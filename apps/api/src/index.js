const http = require("http");

const conversations = [
  {
    id: "conv_1",
    customerName: "María Fernández",
    channel: "whatsapp",
    subject: "Consulta por terapia individual",
    lastMessage: "Quería saber honorarios y disponibilidad para la semana próxima.",
    status: "new",
    updatedAt: "2026-03-12T10:00:00Z",
  },
  {
    id: "conv_2",
    customerName: "Julián Gómez",
    channel: "whatsapp",
    subject: "Consulta por Toyota Corolla",
    lastMessage: "¿Sigue disponible? ¿Tomás permuta?",
    status: "interested",
    updatedAt: "2026-03-12T10:15:00Z",
  },
  {
    id: "conv_3",
    customerName: "Laura Pérez",
    channel: "instagram",
    subject: "Primera consulta contable",
    lastMessage: "Necesito asesoramiento para monotributo y facturación.",
    status: "pending",
    updatedAt: "2026-03-12T10:25:00Z",
  },
];

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
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
        routes: ["/", "/health", "/conversations"],
      })
    );
    return;
  }

  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "api" }));
    return;
  }

  if (req.url === "/conversations") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ conversations }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
