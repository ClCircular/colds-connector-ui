import express from "express";
import bodyParser from "body-parser";
import https from "https";
import axios from "axios";
import cors from "cors";
import * as proxy from "./proxy.js";

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

let connectorHost = "http://localhost";
let customAPIPort = ":19191";
let managementAPIPort = ":19193";

// let auth = {
//   username: "admin",
//   password: "password",
// };

// let httpsAgent = new https.Agent({
//   maxVersion: "TLSv1.2",
//   minVersion: "TLSv1.2",
//   rejectUnauthorized: false,
// });

// initialize health before basicAuth to allow access without authentication
app.use("/health", function (req, res) {
  res.end("OK");
});

// dynamic proxy towards the Dataspace Connector
app.post("/", async (req, res) => {
  let petition = req.body;
  console.log(`Received petition ${JSON.stringify(petition)}`);

  let body = petition.body;
  let params = petition.params;
  let requestParams = "";
  let i = 0;
  if (params != undefined) {
    console.log("Adding request params to the endpointURL");
    for (let key in params) {
      if (i === 0) {
        requestParams += "?" + key + "=" + params[key];
      } else {
        requestParams += "&" + key + "=" + params[key];
      }
      i++;
    }
  }
  let dataFromConnector;
  let fullURL = `${connectorHost}:${customAPIPort}${petition.url}${requestParams}`;
  // console.log(`Sending ${petition.type} request to ${fullURL}`);
  switch (petition.type) {
    case "GET":
      if (petition.url === "/assets") var response = await proxy.getAllAssets();
      else if (petition.url === "/policies")
        var response = await proxy.getAllPolicies();
      else if (petition.url === "/contracts")
        var response = await proxy.getAllContracts();
      else if (petition.url === "/catalogs")
        var response = await proxy.getAllCatalogsFromMetadataBroker();
      else var response = {};
      break;
    case "POST":
      if (petition.url === "/assets")
        var response = await proxy.createNewAsset(petition.body);
      if (petition.url === "/policies")
        var response = await proxy.createNewPolicy(petition.body);
      if (petition.url === "/contracts")
        var response = await proxy.createNewContract(petition.body);
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
  // console.log(response);
  dataFromConnector = response;
  res.send(response);
  // res.send("ok");
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
