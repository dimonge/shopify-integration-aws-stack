const _ = require("lodash");

const Kinesis = require("@modeliver_admin/sls-utils").KINESIS;
const Log = require("@modeliver_admin/sls-utils").LOG;

const ORDER = require("./models").ORDER;
const METADATA = require("./models").METADATA;

module.exports.handler = async (event, context) => {
  try {
    const records = event.Records;
    console.log("Records", records && records.length);
    for (const record of records) {
      const payload = Kinesis.parsePayload(record);

      // verify the Shopify topic
      const shopifyTopic = getShopifyTopic(payload);
      const process = await processOrderFromKinesis(shopifyTopic, payload);
      Log.info(`Order changes.`, { payload, process });
    }
    return {
      statusCode: 200,
      message: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: JSON.stringify({ message: `An error has occurred.` }),
    };
  }
};

const getShopifyTopic = (payload) => {
  if (!payload) return null;
  else if (payload && payload.detail && payload.detail.metadata) {
    return payload.detail.metadata[METADATA.X_SHOPIFY_TOPIC];
  }
};

const getOrder = (payload) => {
  if (!payload) return null;
  else if (payload && payload.detail && payload.detail.payload) {
    return payload.detail.payload;
  }
};
const getShop = (payload) => {
  if (!payload) return null;
  else if (payload && payload.detail && payload.detail.metadata) {
    return payload.detail.metadata[METADATA.X_SHOPIFY_SHOP_DOMAIN];
  }
};

const processOrderFromKinesis = async (topic, payload) => {
  if (!topic) {
    Log.error(`Shopify Topic is not defined`, { topic }, `Not found`);
    return null;
  }
  const order = getOrder(payload);
  const shop = getShop(payload);
  Log.info("Processing the order", { topic, order, shop });
  const route = ORDER.routes[topic];
  if (!!route) {
    return await ORDER.routes[topic](order, { shop });
  }
  return null;
};
