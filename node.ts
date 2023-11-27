import { statSync, readFileSync } from "node:fs";
import { createReadStream } from "node:fs";
import path from "node:path";
import http from "node:http";

const host = "localhost";
const port = 8888;

const requestListener = function (req: any, res: any) {
  console.log("[request]", req.url);
  switch (req.url) {
    case "/download/pdf": {
      const filePath = path.join(__dirname, "mb.pdf");
      const stat = statSync(filePath);

      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Length": stat.size,
      });

      const readStream = createReadStream(filePath);

      readStream.on("data", function () {
        console.log("Reading data...");
      });

      readStream.on("error", function (err) {
        console.log(err);
      });

      readStream.on("end", function () {
        console.log("File read successfully.");
      });

      readStream.on("close", function () {
        console.log("Stream closed.");
      });

      readStream.on("finish", function () {
        console.log("All writes are now complete.");
      });

      readStream.pipe(res);
      break;
    }
    case "/download/pdf/sync": {
      const filePath = path.join(__dirname, "mb.pdf");
      const stat = statSync(filePath);

      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Length": stat.size,
      });

      const buffer = readFileSync(filePath);

      res.end(buffer);
      break;
    }
    case "/about": {
      res.writeHead(200);
      res.end("About Page");
      break;
    }
    default: {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Resource not found" }));
    }
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
