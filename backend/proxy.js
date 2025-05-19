//**************************************************************//
//            ___| | ___(_)_ __ ___ _   _| | __ _ _ __          //
//           / __| |/ __| | '__/ __| | | | |/ _` | '__|         //
//          | (__| | (__| | | | (__| |_| | | (_| | |            //
//           \___|_|\___|_|_|  \___|\__,_|_|\__,_|_|            //
//                                                              //
//                     Copyright (c) 2025                       //
//                       Artic Sea, S.L.                        //
//                      www.clcircular.com                      //
//                                                              //
//**************************************************************//
//            Licensing information, do not remove.             //
//                                                              //
// No part of this source file may be reproduced or adapted in  //
// any form  or by any means, electronic or mechanical, without //
// permission from Artic Sea, S.L.                              //
//                                                              //
// This source file is  confidential and  may not be  disclosed,//
// or reverse engineered without permission in writing from     //
// Artic Sea, S.L.                                              //
//                                                              //
//**************************************************************//
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

let connectorHost = "http://localhost";
let customAPI = "19191/api";
let managementAPI = "19193/management";
let connectorVersion = "v3";

let metadataBrokerHost = "http://localhost";
let catalogAPI = "39195/api/catalog";
let metadataBrokerVersion = "v1alpha";

export async function getAllAssets() {
  let fullURL = `${connectorHost}:${managementAPI}/${connectorVersion}/assets/request`;
  console.log("Getting all assets");
  var response = await fetch(fullURL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      "@type": "QuerySpec",
    }),
  });
  let data = await response.json();
  let assets = [];
  console.log(data);

  for (let connectorAsset of data) {
    // console.log(connectorResource);
    let asset = {
      offerId: connectorAsset["@id"],
      // creationDate: connectorResource.creationDate,
      // modificationDate: connectorResource.modificationDate,
      title: connectorAsset.properties.name,
      dataType: connectorAsset.dataAddress.type,
      url: connectorAsset.dataAddress.baseUrl,
      // keywords: connectorResource.keywords,
      // publisher: connectorResource.publisher,
      // language: connectorResource.language,
      // license: connectorResource.license,
      // version: connectorResource.version,
      // sovereign: connectorResource.sovereign,
      // paymentModality: connectorResource.paymentModality,
    };

    assets.push(asset);
  }
  return { data: assets };
}

export async function createNewAsset(assetParams) {
  let fullURL = `${connectorHost}:${managementAPI}/${connectorVersion}/assets`;
  console.log(`Sending new asset to ${fullURL}`);
  let body = {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
    },
    "@id": uuidv4(),
    properties: {
      name: assetParams.name,
      contenttype: assetParams.contenttype,
    },
    dataAddress: {
      type: assetParams.assetType,
      baseUrl: assetParams.baseUrl,
    },
  };
  var response = await fetch(fullURL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  let data = await response.json();
  console.log(data);
  return data;
}

export async function createNewPolicy(policyParams) {
  let fullURL = `${connectorHost}:${managementAPI}/${connectorVersion}/policydefinitions`;
  console.log(`Sending new policy to ${fullURL}`);
  let body = {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
      odrl: "http://www.w3.org/ns/odrl/2/",
    },
    "@id": uuidv4(),
    policy: {
      "@context": "http://www.w3.org/ns/odrl.jsonld",
      "@type": "Set",
      permission: policyParams.permission,
      prohibition: policyParams.prohibition,
      obligation: policyParams.obligation,
    },
  };
  var response = await fetch(fullURL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  let data = await response.json();
  console.log(data);
  return data;
}

export async function createNewContract(contractParams) {
  let fullURL = `${connectorHost}:${managementAPI}/${connectorVersion}/contractdefinitions`;
  console.log(`Sending new contract to ${fullURL}`);
  let body = {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
    },
    "@id": uuidv4(),
    accessPolicyId: contractParams.accessPolicyId,
    contractPolicyId: contractParams.contractPolicyId,
    assetsSelector: [
      {
        operandLeft: "https://w3id.org/edc/v0.0.1/ns/id",
        operator: "in",
        operandRight: [contractParams.assets],
      },
    ],
  };

  var response = await fetch(fullURL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  let data = await response.json();
  console.log(data);
  return data;
}

export async function getAllContracts() {
  let fullURL = `${connectorHost}:${managementAPI}/${connectorVersion}/contractdefinitions/request`;
  console.log(`Sending get contracts to ${fullURL}`);

  var response = await fetch(fullURL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      "@type": "QuerySpec",
    }),
  });
  let data = await response.json();
  let contracts = [];
  console.log(data);
  for (let connectorResource of data) {
    // console.log(connectorResource);
    let policy = {
      contractId: connectorResource["@id"],
      accessPolicyId: connectorResource.accessPolicyId,
      contractPolicyId: connectorResource.contractPolicyId,
      assets: [connectorResource.assetsSelector.operandRight],
    };

    contracts.push(policy);
  }

  return { data: contracts };
}

export async function getAllPolicies() {
  let fullURL = `${connectorHost}:${managementAPI}/${connectorVersion}/policydefinitions/request`;

  var response = await fetch(fullURL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      "@type": "QuerySpec",
    }),
  });
  let data = await response.json();
  let policies = [];
  for (let connectorResource of data) {
    // console.log(connectorResource);
    let policy = {
      policyId: connectorResource["@id"],
      creationDate: new Date(connectorResource.createdAt).toISOString(),
      permission: [],

      prohibition: connectorResource.policy["odrl:prohibition"],
      obligation: connectorResource.policy["odrl:obligation"],
    };

    policy.permission = getPolicyParameters(
      connectorResource.policy,
      "permission"
    );
    policy.prohibition = getPolicyParameters(
      connectorResource.policy,
      "prohibition"
    );
    policy.obligation = getPolicyParameters(
      connectorResource.policy,
      "obligation"
    );

    policies.push(policy);
  }

  return { data: policies };
}

function getPolicyParameters(connectorResource, parameterName) {
  let array = [];
  if (
    connectorResource[`odrl:${parameterName}`]?.["odrl:constraint"]?.length !=
    undefined
  ) {
    for (let permission of connectorResource[`odrl:${parameterName}`]?.[
      "odrl:constraint"
    ]) {
      array.push({
        action: connectorResource[`odrl:${parameterName}`]?.["odrl:action"]?.[
          "@id"
        ].replace(/^.*?:/, ""),
        constraintType: permission?.["odrl:leftOperand"]?.["@id"].replace(
          /^.*?:/,
          ""
        ),
        constraintValue: permission?.["odrl:rightOperand"],
      });
    }
  } else {
    array.push({
      action: connectorResource[`odrl:${parameterName}`]?.["odrl:action"]?.[
        "@id"
      ].replace(/^.*?:/, ""),
      constraintType: connectorResource[`odrl:${parameterName}`]?.[
        "odrl:constraint"
      ]?.["odrl:leftOperand"]?.["@id"].replace(/^.*?:/, ""),
      constraintValue:
        connectorResource[`odrl:${parameterName}`]?.["odrl:constraint"]?.[
          "odrl:rightOperand"
        ],
    });
  }
  return array;
}

export async function getAllCatalogsFromMetadataBroker() {
  let fullURL = `${metadataBrokerHost}:${catalogAPI}/${metadataBrokerVersion}/catalog/query`;
  console.log(`Sending get catalogs to ${fullURL}`);
  var response = await fetch(
    "http://localhost:39195/api/catalog/v1alpha/catalog/query",
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response);
  let data = await response.json();
  let catalogs = [];
  console.log(data);
  for (let connectorResource of data) {
    // console.log(connectorResource);
    let catalog = {
      participantId: connectorResource["dspace:participantId"],
      dataset: [],
    };
    if (connectorResource["dcat:dataset"]?.length != undefined) {
      for (let asset of connectorResource["dcat:dataset"]) {
        catalog.dataset.push({
          assetId: asset["@id"],
          assetName: asset.name,
          contentType: asset.contenttype,
          distributionType: asset["dcat:distribution"]["dct:format"]["@id"],
          policy: getPolicyParameters(asset["odrl:hasPolicy"], "permission"),
        });
      }
    } else {
      catalog.dataset.push({
        assetId: connectorResource["dcat:dataset"]["@id"],
        assetName: connectorResource["dcat:dataset"].name,
        contentType: connectorResource["dcat:dataset"].contenttype,
        distributionType:
          connectorResource["dcat:dataset"]["dcat:distribution"]["dct:format"][
            "@id"
          ],
        policy: getPolicyParameters(
          connectorResource["dcat:dataset"]["odrl:hasPolicy"],
          "permission"
        ),
      });
    }
    catalogs.push(catalog);
  }

  return { data: catalogs };
}
