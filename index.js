const http = require("http");
const express = require("express");

const { detectText, multerUpload } = require("./detect-text");

const app = express();
const port = 8000;

const server = http.createServer(app);

app.use(express.json());

app.route("/api/get-text").get(detectText).post(multerUpload, detectText);

app.use((_, response) =>
  response.json({ code: 404, message: "Error", data: "Not found" })
);

server.listen(port, (_) => console.log(`server listening on port ${port}`));
