const loadBtn = document.getElementById("loadBtn");
const conversationList = document.getElementById("conversationList");
const chatDetail = document.getElementById("chatDetail");

let conversationsState = [];
let selectedConversationId = null;

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleString("es-AR");
}

function getSelectedConversation() {
  return conversationsState.find((item) => item.id === selectedConversationId) || null;
}

function channelLabel(channel) {
  if (channel === "whatsapp") return "WhatsApp";
  if (channel === "instagram") return "Instagram";
  if (channel === "telegram") return "Telegram";
  return channel;
}

function statusLabel(status) {
  if (status === "new") return "Nuevo";
  if (status === "pending") return "Pendiente";
  if (status === "interested") return "Interesado";
  if (status === "closed") return "Cerrado";
  if (status === "answered") return "Respondido";
  return status;
}

function replaceConversation(updatedConversation) {
  conversationsState = conversationsState.map((conversation) =>
    conversation.id === updatedConversation.id ? updatedConversation : conversation
  );
}

async function updateLeadStatus(conversationId, status) {
  try {
    const response = await fetch("http://localhost:3001/lead-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        status,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo actualizar el estado");
    }

    replaceConversation(data.conversation);
    renderConversations(conversationsState);
    renderChatDetail(data.conversation);
  } catch (error) {
    alert(`Error al actualizar estado: ${error.message}`);
  }
}

function renderChatDetail(conversation) {
  if (!conversation) {
    chatDetail.innerHTML = "<p>Seleccioná una conversación para ver el detalle.</p>";
    return;
  }

  chatDetail.innerHTML = `
    <div class="chat-layout">
      <div class="chat-main">
        <div class="chat-header">
          <h3>${conversation.customer.name}</h3>
          <div class="meta">
            Canal: <span class="channel-badge ${conversation.channel}">${channelLabel(conversation.channel)}</span>
            · Asunto: ${conversation.subject}
          </div>
          <div class="status">Estado: ${statusLabel(conversation.status)}</div>
        </div>

        <div class="chat-messages" id="chatMessages">
          ${conversation.messages
            .map(
              (message) => `
                <div class="message ${message.from}">
                  <div class="message-channel">${channelLabel(message.channel)}</div>
                  <div>${message.text}</div>
                  <div class="message-time">${formatDate(message.sentAt)}</div>
                </div>
              `
            )
            .join("")}
        </div>

        <form id="replyForm" class="reply-form">
          <textarea
            id="replyInput"
            class="reply-input"
            placeholder="Escribí una respuesta..."
            rows="3"
          ></textarea>
          <div class="reply-actions">
            <button type="submit">Enviar</button>
          </div>
        </form>
      </div>

      <aside class="customer-panel">
        <h4>Cliente y lead</h4>

        <div class="info-group">
          <div class="info-label">Nombre</div>
          <div class="info-value">${conversation.customer.name}</div>
        </div>

        <div class="info-group">
          <div class="info-label">Canal</div>
          <div class="info-value">${channelLabel(conversation.channel)}</div>
        </div>

        <div class="info-group">
          <div class="info-label">Usuario externo</div>
          <div class="info-value">${conversation.customer.externalUserId}</div>
        </div>

        <div class="info-group">
          <div class="info-label">Teléfono</div>
          <div class="info-value">${conversation.customer.phone || "No disponible"}</div>
        </div>

        <div class="info-group">
          <div class="info-label">Estado lead</div>
          <div class="info-value">${statusLabel(conversation.lead?.status || "new")}</div>
        </div>

        <div class="info-group">
          <div class="info-label">Interés</div>
          <div class="info-value">${conversation.lead?.interest || "Sin definir"}</div>
        </div>

        <div class="info-group">
          <div class="info-label">Prioridad</div>
          <div class="info-value">${conversation.lead?.priority || "Normal"}</div>
        </div>

        <div class="info-group">
          <div class="info-label">Última actualización</div>
          <div class="info-value">${formatDate(conversation.updatedAt)}</div>
        </div>

        <div class="lead-actions">
          <div class="info-label">Acciones rápidas</div>
          <div class="lead-action-buttons">
            <button class="lead-btn" data-status="new">Nuevo</button>
            <button class="lead-btn" data-status="pending">Pendiente</button>
            <button class="lead-btn" data-status="interested">Interesado</button>
            <button class="lead-btn" data-status="closed">Cerrar</button>
          </div>
        </div>
      </aside>
    </div>
  `;

  const replyForm = document.getElementById("replyForm");
  const replyInput = document.getElementById("replyInput");

  replyForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const text = replyInput.value.trim();
    if (!text) return;

    try {
      const response = await fetch("http://localhost:3001/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversation.id,
          text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo enviar la respuesta");
      }

      replaceConversation(data.conversation);
      renderConversations(conversationsState);
      renderChatDetail(data.conversation);
    } catch (error) {
      alert(`Error al enviar: ${error.message}`);
    }
  });

  document.querySelectorAll(".lead-btn").forEach((button) => {
    button.addEventListener("click", () => {
      updateLeadStatus(conversation.id, button.dataset.status);
    });
  });
}

function selectConversation(conversationId) {
  selectedConversationId = conversationId;
  const selected = conversationsState.find((item) => item.id === conversationId);
  renderConversations(conversationsState);
  renderChatDetail(selected);
}

function renderConversations(conversations) {
  if (!conversations.length) {
    conversationList.innerHTML = "<p>No hay conversaciones.</p>";
    chatDetail.innerHTML = "<p>No hay conversaciones para mostrar.</p>";
    return;
  }

  conversationList.innerHTML = conversations
    .map(
      (conversation) => `
        <div class="conversation-card ${conversation.id === selectedConversationId ? "active" : ""}" data-id="${conversation.id}">
          <h3>${conversation.customer.name}</h3>
          <div class="meta">
            Canal: <span class="channel-badge ${conversation.channel}">${channelLabel(conversation.channel)}</span>
          </div>
          <div class="meta">Asunto: ${conversation.subject}</div>
          <div>${conversation.lastMessage}</div>
          <div class="status">Estado: ${statusLabel(conversation.status)}</div>
        </div>
      `
    )
    .join("");

  document.querySelectorAll(".conversation-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectConversation(card.dataset.id);
    });
  });
}

async function loadConversations() {
  conversationList.innerHTML = "<p>Cargando conversaciones...</p>";
  chatDetail.innerHTML = "<p>Cargando detalle...</p>";

  try {
    const response = await fetch("http://localhost:3001/conversations");
    const data = await response.json();
    conversationsState = data.conversations || [];
    selectedConversationId = conversationsState[0]?.id || null;
    renderConversations(conversationsState);
    renderChatDetail(conversationsState[0] || null);
  } catch (error) {
    conversationList.innerHTML = `<p>Error al cargar conversaciones: ${error.message}</p>`;
    chatDetail.innerHTML = "<p>No se pudo cargar el detalle.</p>";
  }
}

loadBtn.addEventListener("click", loadConversations);
