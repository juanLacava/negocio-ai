const loadBtn = document.getElementById("loadBtn");
const conversationList = document.getElementById("conversationList");

function renderConversations(conversations) {
  if (!conversations.length) {
    conversationList.innerHTML = "<p>No hay conversaciones.</p>";
    return;
  }

  conversationList.innerHTML = conversations
    .map(
      (conversation) => `
        <div class="conversation-card">
          <h3>${conversation.customerName}</h3>
          <div class="meta">
            Canal: ${conversation.channel} · Asunto: ${conversation.subject}
          </div>
          <div>${conversation.lastMessage}</div>
          <div class="status">Estado: ${conversation.status}</div>
        </div>
      `
    )
    .join("");
}

loadBtn.addEventListener("click", async () => {
  conversationList.innerHTML = "<p>Cargando conversaciones...</p>";

  try {
    const response = await fetch("http://localhost:3001/conversations");
    const data = await response.json();
    renderConversations(data.conversations || []);
  } catch (error) {
    conversationList.innerHTML = `<p>Error al cargar conversaciones: ${error.message}</p>`;
  }
});
