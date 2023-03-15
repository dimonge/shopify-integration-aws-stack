const Order = require("./order")

const PAYLOAD = {
  ...Order
}
module.exports = {
  ID: "id",
  VERSION: "version",
  DETAIL_TYPE: "detail-type",
  SOURCE: "source",
  ACCOUNT: "account",
  TIME: "time",
  REGION: "region",
  RESOURCES: [],
  DETAIL: "detail",
  PAYLOAD
}