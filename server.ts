import http from "node:http";

const host = "localhost";
const port = 4444;

const requestListener = async function (req: any, res: any) {
  console.log("[request]", req.url);
  switch (req.url) {
    case "/get-pdf": {
      // eslint-disable-next-line no-console
      console.log("get-pdf");

      const fileUrl = "http://localhost:8888/download/pdf";

      http
        .get(fileUrl, (fileStream) => {
          const totalSize = parseInt(fileStream.headers["content-length"]!, 10);
          let downloadedSize = 0;

          fileStream.on("data", (chunk) => {
            downloadedSize += chunk.length;
            const progress = ((downloadedSize / totalSize) * 100).toFixed(2);
            console.log(`Download progress: ${progress}%`);
          });

          res.setHeader("Content-Type", "application/pdf");
          fileStream.pipe(res);
        })
        .on("error", (e) => {
          console.error(`Got error: ${e.message}`);
          res.status(500).send("Error occurred while downloading file");
        })
        .on("close", () => {
          console.log("File stream closed");
        })
        .on("finish", () => {
          console.log("File stream finished");
        });

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
