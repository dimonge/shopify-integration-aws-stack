const TOPICS = {
  CREATE: "orders/create",
  PAID: "orders/paid",
  EDITED: "orders/edited",
  DELETE: "orders/delete",
  FULFILLED: "orders/fulfilled",
  UPDATED: "orders/updated",
  CANCELLED: "orders/cancelled",
  PARTIALLY_FULFILLED: "orders/partially_fulfilled",
  CUSTOMERS_REDACT: "customers/redact",
  SHOP_REDACT: "shop/redact",
  CUSTOMERS_DATA_REQUEST: "customers/data_request",
};

module.exports = {
  TOPICS,
};
