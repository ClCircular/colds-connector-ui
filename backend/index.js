import express from "express";
import bodyParser from "body-parser";
import https from "https";
import axios from "axios";
import cors from "cors";

const app = express();
const port = 8083;

// create application/json parser
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(cors({ credentials: true, origin: true }));

let connectorUrl = "https://3.223.70.98:8080";
let auth = {
  username: "admin",
  password: "password",
};

let httpsAgent = new https.Agent({
  maxVersion: "TLSv1.2",
  minVersion: "TLSv1.2",
  rejectUnauthorized: false,
});

// initialize health before basicAuth to allow access without authentication
app.use("/health", function (req, res) {
  res.end("OK");
});

// dynamic proxy towards the Dataspace Connector
app.post("/", async (req, res) => {
  console.log(req.body);
  let petition = req.body;
  let body = petition.body;
  console.log(`Received petition ${JSON.stringify(petition)}`);
  let dataFromConnector;
  let fullURL = `${connectorUrl}${petition.url}`;

  switch (petition.type) {
    case "GET":
      var response = await axios.get(fullURL, {
        headers: { "content-type": "application/json" },
        auth,
        httpsAgent,
      });
      break;
    case "POST":
      var response = await axios.post(fullURL, body, {
        headers: { "content-type": "application/json" },
        auth,
        httpsAgent,
      });
      break;
    case "PUT":
      var response = await axios.put(fullURL, body, {
        headers: { "content-type": "application/json" },
        auth,
        httpsAgent,
      });
      break;
    case "DELETE":
      var response = await axios.delete(fullURL, {
        data: body,
        headers: { "content-type": "application/json" },
        auth,
        httpsAgent,
      });
      break;
  }
  console.log(response.data);
  dataFromConnector = response.data;
  res.send(dataFromConnector);
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
