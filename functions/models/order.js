const _ = require("lodash");

const DynamoDB = require("@modeliver_admin/sls-utils").DYNAMO_DB;
const Log = require("@modeliver_admin/sls-utils").LOG;
const Utils = require("@modeliver_admin/sls-utils").UTILS;

const metadata = require("./metadata");
const { TOPICS } = require("./topic.shopify");
const CUSTOMER = require("./customer");
const ADDRESS = require("./address");

const ordersTableName = process.env.ordersTable;

const onCreate = async (payload, { shop }) => {
  try {
    const params = {
      TableName: ordersTableName,
      Item: { ...payload, shop, orderId: payload.id },
    };

    Log.info("Orders ", { order: payload, shop, params });
    // create new addresses
    const address = await ADDRESS.onCreate(payload);
    // link addresses to customer & create customer
    const customer = await CUSTOMER.onCreate(payload, { shop });
    // create new orders

    const order = await DynamoDB.put(params);
    Log.info(`Order has been saved: `, { params });

    return {
      order: order.Item,
      address,
      customer,
    };
  } catch (error) {
    Log.error(`An error occurred: `, { payload }, error);
    return null;
  }
};

/**
 * Delete payload
 * {
  "id": 820982911946154508,
  "total_tip_received": "0.0",
  "original_total_duties_set": null,
  "current_total_duties_set": null,
  "admin_graphql_api_id": "gid:\/\/shopify\/Order\/820982911946154508"
}
 */
const onDelete = async (payload, { shop }) => {
  let params = {
    TableName: ordersTableName,
    Item: {
      shop,
      orderId: payload.id,
    },
    ExpressionAttributeValues: { ":deleted_at": Date.now() },
    ExpressionAttributeNames: {
      "#deleted_at": "deleted_at",
    },
    UpdateExpression: "#deleted_at=:deleted_at",
    ReturnValues: "UPDATED_NEW",
  };
  try {
    Log.info(`Order is deleted`, { payload });
    await DynamoDB.deleteItem(params);
    return payload.id;
  } catch (error) {
    Log.error("An error has occurred", { payload, shop }, error);
    return null;
  }
};

const onEdit = async (payload, { shop }) => {
  let params = {
    TableName: ordersTableName,
    Key: {
      shop,
      orderId: payload.id,
    },
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: "",
    ReturnValues: "UPDATED_NEW",
  };
  let prefix = "set ";
  let attributes = Object.keys(payload);

  for (let index = 0; index < attributes.length; index++) {
    let attribute = attributes[index];
    if (attribute !== "id") {
      params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
      params["ExpressionAttributeValues"][":" + attribute] = payload[attribute];
      params["ExpressionAttributeNames"]["#" + attribute] = attribute;
      prefix = ", ";
    }
  }
  try {
    Log.info(`Order is updated`, { payload });
    await DynamoDB.update(params);
    return payload;
  } catch (error) {
    Log.error("Error has occurred", { payload }, error);
    return null;
  }
};

const onGdprDataRequest = async (payload) => {
  try {
    const data = {
      id: Utils.generateUUID(),
      shop: _.get(payload, "shop_domain"),
      ...payload,
    };

    Log.info("gdpr data request", { payload, data });

    await DynamoDB.put({ TableName: gdprRequestTable, Item: data });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Your request has been received. We will process it accordingly." }),
    };
  } catch (error) {
    Log.error("Error has occurred", { payload }, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error has occurred." }),
    };
  }
};

const routes = {
  [TOPICS.CREATE]: onCreate,
  [TOPICS.CANCELLED]: onEdit,
  [TOPICS.EDITED]: onEdit,
  [TOPICS.FULFILLED]: onEdit,
  [TOPICS.PAID]: onEdit,
  [TOPICS.PARTIALLY_FULFILLED]: onEdit,
  [TOPICS.DELETE]: onDelete,
  [TOPICS.UPDATED]: onEdit,
  [TOPICS.CUSTOMERS_DATA_REQUEST]: onGdprDataRequest,
  [TOPICS.CUSTOMERS_REDACT]: onGdprDataRequest,
  [TOPICS.SHOP_REDACT]: onGdprDataRequest,
};

const PRICE_SET = {
  SHOP_MONEY: "shop_money",
  shop_money: {
    AMOUNT: "amount",
    CURRENCY_CODE: "currency_code",
  },
  PRESENTMENT_MONEY: "presentment_money",
  presentment_money: {
    AMOUNT: "amount",
    CURRENCY_CODE: "currency_code",
  },
};
module.exports = {
  API: {
    ID: "id",
    EMAIL: "email",
    CLOSED_AT: "closed_at",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
    NUMBER: "number",
    NOTE: "note",
    TOKEN: "token",
    GATEWAY: "gateway",
    TEST: "test",
    TOTAL_PRICE: "total_price",
    SUBTOTAL_PRICE: "subtotal_price",
    TOTAL_WEIGHT: "total_weight",
    TOTAL_TAX: "total_tax",
    TAXES_INCLUDED: "taxes_included",
    CURRENCY: "currency",
    FINANCIAL_STATUS: "financial_status",
    CONFIRMED: "confirmed",
    TOTAL_DISCOUNTS: "total_discounts",
    TOTAL_LINE_ITEMS_PRICE: "total_line_items_price",
    CART_TOKEN: "cart_token",
    BUYER_ACCEPTS_MARKETING: "buyer_accepts_marketing",
    NAME: "name",
    REFERRING_SITE: "referring_site",
    LANDING_SITE: "landing_site",
    CANCELLED_AT: "cancelled_at",
    CANCEL_REASON: "cancel_reason",
    TOTAL_PRICE_USD: "total_price_usd",
    CHECKOUT_TOKEN: "checkout_token",
    REFERENCE: "reference",
    USER_ID: "user_id",
    LOCATION_ID: "location_id",
    SOURCE_IDENTIFIER: "source_identifier",
    SOURCE_URL: "source_url",
    PROCESSED_AT: "processed_at",
    DEVICE_ID: "device_id",
    PHONE: "phone",
    CUSTOMER_LOCALE: "customer_locale",
    APP_ID: "app_id",
    BROWSER_IP: "browser_ip",
    LANDING_SITE_REF: "landing_site_ref",
    ORDER_NUMBER: "order_number",
    DISCOUNT_APPLICATIONS: "discount_applications",
    DISCOUNT_CODES: "discount_codes",
    NOTE_ATTRIBUTES: "note_attributes",
    PAYMENT_GATEWAY_NAMES: "payment_gateway_names",
    PROCESSING_METHOD: "processing_method",
    CHECKOUT_ID: "checkout_id",
    SOURCE_NAME: "source_name",
    FULFILLMENT_STATUS: "fulfillment_status",
    TAX_LINES: "tax_lines",
    TAGS: "tags",
    CONTACT_EMAIL: "contact_email",
    ORDER_STATUS_URL: "order_status_url",
    PRESENTMENT_CURRENCY: "presentment_currency",
    TOTAL_LINE_ITEMS_PRICE_SET: "total_line_items_price_set",
    total_line_items_price_set: PRICE_SET,
    TOTAL_DISCOUNTS_SET: "total_discounts_set",
    total_discounts_set: PRICE_SET,
    TOTAL_SHIPPING_PRICE_SET: "total_shipping_price_set",
    total_shipping_price_set: PRICE_SET,
    SUBTOTAL_PRICE_SET: "subtotal_price_set",
    subtotal_price_set: PRICE_SET,
    TOTAL_PRICE_SET: "total_price_set",
    total_price_set: PRICE_SET,
    TOTAL_TAX_SET: "total_tax_set",
    total_tax_set: PRICE_SET,
    LINE_ITEMS: "line_items",
    line_items: {
      ID: "id",
      VARIANT_ID: "variant_id",
      TITLE: "title",
      QUANTITY: "quantity",
      SKU: "sku",
      VARIANT_TITLE: "variant_title",
      VENDOR: "vendor",
      FULFILLMENT_SERVICE: "fulfillment_service",
      PRODUCT_ID: "product_id",
      REQUIRES_SHIPPING: "requires_shipping",

      /**
 * {
        "fulfillment_service": "manual",
        "product_id": 632910392,
        "requires_shipping": true,
        "taxable": true,
        "gift_card": false,
        "name": "IPod Nano - 8gb - green",
        "variant_inventory_management": "shopify",
        "properties": [
          {
            "name": "Custom Engraving Front",
            "value": "Happy Birthday"
          },
          {
            "name": "Custom Engraving Back",
            "value": "Merry Christmas"
          }
        ],
        "product_exists": true,
        "fulfillable_quantity": 1,
        "grams": 200,
        "price": "199.00",
        "total_discount": "0.00",
        "fulfillment_status": null,
        "price_set": {
          "shop_money": {
            "amount": "199.00",
            "currency_code": "USD"
          },
          "presentment_money": {
            "amount": "199.00",
            "currency_code": "USD"
          }
        },
        "total_discount_set": {
          "shop_money": {
            "amount": "0.00",
            "currency_code": "USD"
          },
          "presentment_money": {
            "amount": "0.00",
            "currency_code": "USD"
          }
        },
        "discount_allocations": [
          {
            "amount": "3.34",
            "discount_application_index": 0,
            "amount_set": {
              "shop_money": {
                "amount": "3.34",
                "currency_code": "USD"
              },
              "presentment_money": {
                "amount": "3.34",
                "currency_code": "USD"
              }
            }
          }
        ],
 */
    },
    FULFILLMENTS: "fulfillments",
    REFUNDS: "refunds",
    TOTAL_TIP_RECEIVED: "total_tip_received",
    ORIGINAL_TOTAL_DUTIES_SET: "original_total_duties_set",
    CURRENT_TOTAL_DUTIES_SET: "current_total_duties_set",
    ADMIN_GRAPHQL_API_ID: "admin_graphql_api_id",
    SHIPPING_LINES: "shipping_lines",
    discount_applications: {
      TYPE: "type",
      VALUE: "value",
      VALUE_TYPE: "value_type",
      ALLOCATION_METHOD: "allocation_method",
      TARGET_SELECTION: "target_selection",
      TARGET_TYPE: "target_type",
      CODE: "code",
    },
    discount_codes: {
      CODE: "code",
      AMOUNT: "amount",
      TYPE: "fixed_amount",
    },
    note_attributes: {
      NAME: "name",
      VALUE: "value",
    },
    tax_lines: {
      PRICE: "price",
      RATE: "rate",
      TITLE: "title",
      PRICE_SET: "price_set",
      price_set: PRICE_SET,
    },
  },
  METADATA: metadata,
  routes,
};
