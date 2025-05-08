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

export async function getAllOffers(fullURL, auth, httpsAgent) {
  var response = await axios.get(fullURL, {
    headers: { "content-type": "application/json" },
    auth,
    httpsAgent,
  });
  let offers = [];
  for (let connectorResource of response.data._embedded.resources) {
    // console.log(connectorResource);
    let offer = {
      offerId: connectorResource._links.self.href.match(
        /offers\/([a-f0-9\-]+)$/i
      )[1],
      creationDate: connectorResource.creationDate,
      modificationDate: connectorResource.modificationDate,
      title: connectorResource.title,
      description: connectorResource.description,
      keywords: connectorResource.keywords,
      publisher: connectorResource.publisher,
      language: connectorResource.language,
      license: connectorResource.license,
      version: connectorResource.version,
      sovereign: connectorResource.sovereign,
      paymentModality: connectorResource.paymentModality,
    };

    const [catalog, contracts, representations, subscriptions, brokers] =
      await Promise.all([
        await axios.get(
          connectorResource._links.catalogs.href.replace(/\{.*\}$/, ""),
          {
            headers: { "content-type": "application/json" },
            auth,
            httpsAgent,
          }
        ),
        await axios.get(
          connectorResource._links.contracts.href.replace(/\{.*\}$/, ""),
          {
            headers: { "content-type": "application/json" },
            auth,
            httpsAgent,
          }
        ),
        await axios.get(
          connectorResource._links.representations.href.replace(/\{.*\}$/, ""),
          {
            headers: { "content-type": "application/json" },
            auth,
            httpsAgent,
          }
        ),
        await axios.get(
          connectorResource._links.subscriptions.href.replace(/\{.*\}$/, ""),
          {
            headers: { "content-type": "application/json" },
            auth,
            httpsAgent,
          }
        ),
        await axios.get(
          connectorResource._links.brokers.href.replace(/\{.*\}$/, ""),
          {
            headers: { "content-type": "application/json" },
            auth,
            httpsAgent,
          }
        ),
      ]);

    // Getting catalog of offer
    offer.catalogs = catalog.data._embedded.catalogs.map((item) => ({
      title: item.title,
      catalogId: item._links.self.href.match(/catalogs\/([a-f0-9\-]+)$/i)[1],
    }));

    // Getting contracts of offer
    offer.contracts = contracts.data._embedded.contracts.map((item) => ({
      title: item.title,
      contractId: item._links.self.href.match(/contracts\/([a-f0-9\-]+)$/i)[1],
    }));

    // Getting representations of offer
    offer.representations = representations.data._embedded.representations.map(
      (item) => ({
        title: item.title,
        representationId: item._links.self.href.match(
          /representations\/([a-f0-9\-]+)$/i
        )[1],
      })
    );

    // Getting subscriptions of offer
    offer.subscriptions = subscriptions.data._embedded.subscriptions.map(
      (item) => ({
        title: item.title,
        subscriptionId: item._links.self.href.match(
          /subscriptions\/([a-f0-9\-]+)$/i
        )[1],
      })
    );

    // Getting brokers of offer: NOTE: esto no se va a usar en principio
    offer.brokers = brokers.data._embedded.brokers.map((item) => ({
      title: item.title,
      brokerId: item._links.self.href.match(/brokers\/([a-f0-9\-]+)$/i)[1],
    }));

    offers.push(offer);
  }
  return { data: offers };
}

export async function getAllCatalogs(fullURL, auth, httpsAgent) {
  var response = await axios.get(fullURL, {
    headers: { "content-type": "application/json" },
    auth,
    httpsAgent,
  });
  let catalogs = [];
  for (let connectorResource of response.data._embedded.catalogs) {
    let catalog = {
      catalogId: connectorResource._links.self.href.match(
        /catalogs\/([a-f0-9\-]+)$/i
      )[1],
      creationDate: connectorResource.creationDate,
      modificationDate: connectorResource.modificationDate,
      title: connectorResource.title,
      description: connectorResource.description,
    };

    // Getting subscriptions of offer
    let offers = await axios.get(
      connectorResource._links.offers.href.replace(/\{.*\}$/, ""),
      {
        headers: { "content-type": "application/json" },
        auth,
        httpsAgent,
      }
    );
    catalog.offers = offers.data._embedded.resources.map((item) => ({
      title: item.title,
      offerId: item._links.self.href.match(/offers\/([a-f0-9\-]+)$/i)[1],
    }));

    catalogs.push(catalog);
  }
  return { data: catalogs };
}

export async function getAllContracts(fullURL, auth, httpsAgent) {
  var response = await axios.get(fullURL, {
    headers: { "content-type": "application/json" },
    auth,
    httpsAgent,
  });
  let contracts = [];
  for (let connectorResource of response.data._embedded.contracts) {
    // console.log(connectorResource);
    let contract = {
      contractId: connectorResource._links.self.href.match(
        /contracts\/([a-f0-9\-]+)$/i
      )[1],
      creationDate: connectorResource.creationDate,
      modificationDate: connectorResource.modificationDate,
      title: connectorResource.title,
      description: connectorResource.description,
      start: connectorResource.start,
      end: connectorResource.end,
    };

    // Getting subscriptions of offer
    const [rules, offers] = await Promise.all([
      await axios.get(
        connectorResource._links.rules.href.replace(/\{.*\}$/, ""),
        {
          headers: { "content-type": "application/json" },
          auth,
          httpsAgent,
        }
      ),
      await axios.get(
        connectorResource._links.offers.href.replace(/\{.*\}$/, ""),
        {
          headers: { "content-type": "application/json" },
          auth,
          httpsAgent,
        }
      ),
    ]);
    contract.rules = rules.data._embedded.rules.map((item) => ({
      title: item.title,
      type: JSON.parse(item.value)["@type"],
      ruleId: item._links.self.href.match(/rules\/([a-f0-9\-]+)$/i)[1],
    }));
    contract.offers = offers.data._embedded.resources.map((item) => ({
      title: item.title,
      offerId: item._links.self.href.match(/offers\/([a-f0-9\-]+)$/i)[1],
    }));

    contracts.push(contract);
  }
  return { data: contracts };
}
