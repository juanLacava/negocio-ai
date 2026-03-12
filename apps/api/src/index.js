const http = require("http");
const { getMockWhatsAppConversations } = require("../../../packages/integrations/whatsapp");

const instagramAndTelegramConversations = [
  {
    id: "conv_ig_1",
    channel: "instagram",
    externalConversationId: "ig_2001",
    customer: {
      id: "cust_ig_1",
      name: "Laura Pérez",
      externalUserId: "ig_user_2001",
    },
    subject: "Primera consulta contable",
    lastMessage: "Necesito asesoramiento para monotributo y facturación.",
    status: "pending",
    updatedAt: "2026-03-12T10:25:00Z",
    messages: [
      {
        id: "msg_ig_1",
        direction: "inbound",
        from: "customer",
        text: "Hola, necesito asesoramiento contable.",
        sentAt: "2026-03-12T10:20:00Z",
        channel: "instagram",
      },
      {
        id: "msg_ig_2",
        direction: "inbound",
        from: "customer",
        text: "Necesito asesoramiento para monotributo y facturación.",
        sentAt: "2026-03-12T10:25:00Z",
        channel: "instagram",
      },
    ],
  },
  {
    id: "conv_tg_1",
    channel: "telegram",
    externalConversationId: "tg_3001",
    customer: {
      id: "cust_tg_1",
      name: "Julián Gómez",
      externalUserId: "tg_user_3001",
    },
    subject: "Consulta por Toyota Corolla",
    lastMessage: "¿Sigue disponible? ¿Tomás permuta?",
    status: "interested",
    updatedAt: "2026-03-12T10:15:00Z",
    messages: [
      {
        id: "msg_tg_1",
        direction: "inbound",
        from: "customer",
        text: "Hola, ¿sigue disponible el Toyota Corolla?",
        sentAt: "2026-03-12T10:10:00Z",
        channel: "telegram",
      },
      {
        id: "msg_tg_2",
        direction: "inbound",
        from: "customer",
        text: "¿Tomás permuta?",
        sentAt: "2026-03-12T10:15:00Z",
        channel: "telegram",
      },
    ],
  },
];

let conversationsState = [
  ...getMockWhatsAppConversations(),
  ...instagramAndTelegramConversations,
];

function getAllConversations() {
  return conversationsState;
}

function sendReply(conversationId, text) {
  const conversation = conversationsState.find((item) => item.id === conversationId);

  if (!conversation) {
    return null;
  }

  const now = new Date().toISOString();

  const newMessage = {
    id: `msg_${Date.now()}`,
    direction: "outbound",
    from: "agent",
    text,
    sentAt: now,
    channel: conversation.channel,
  };

  conversation.messages.push(newMessage);
  conversation.lastMessage = text;
  conversation.updatedAt = now;
  conversation.status = "answered";

  return conversation;
}

function collectRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      resolve(body);
    });

    req.on("error", (error) => {
      reject(error);
    });
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        ok: true,
        service: "api",
        routes: ["/", "/health", "/conversations", "/channels", "/reply"],
      })
    );
    return;
  }

  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "api" }));
    return;
  }

  if (req.url === "/channels") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        channels: ["whatsapp", "instagram", "telegram"],
        primary: "whatsapp",
      })
    );
    return;
  }

  if (req.url === "/conversations" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ conversations: getAllConversations() }));
    return;
  }

  if (req.url === "/reply" && req.method === "POST") {
    try {
      const rawBody = await collectRequestBody(req);
      const body = JSON.parse(rawBody || "{}");

      if (!body.conversationId || !body.text) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "conversationId and text are required" }));
        return;
      }

      const updatedConversation = sendReply(body.conversationId, body.text);

      if (!updatedConversation) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Conversation not found" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ conversation: updatedConversation }));
      return;
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON body" }));
      return;
    }
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
