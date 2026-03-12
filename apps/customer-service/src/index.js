console.log("customer-service app base running");
const http = require("http");
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

const server = http.createServer((req, res) => {
  let filePath = path.join(publicDir, req.url === "/" ? "index.html" : req.url);

  const ext = path.extname(filePath);
  const contentType =
    ext === ".html"
      ? "text/html"
      : ext === ".css"
      ? "text/css"
      : ext === ".js"
      ? "application/javascript"
      : "text/plain";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

server.listen(3000, () => {
  console.log("Customer service app running on http://localhost:3000");
});
