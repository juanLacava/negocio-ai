const http = require("http");

const server = http.createServer((req, res) => {
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
    res.end(JSON.stringify({ conversations: [] }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
