const Log = require("@modeliver_admin/sls-utils").LOG
const DynamoDB = require("@modeliver_admin/sls-utils").DYNAMO_DB


const customersTableName = process.env.customersTable

const onCreate = async (payload, { shop }) => {
  let customer = payload.customer
  if (payload && payload.customer) {
    delete(customer.default_address)
    const params = {
      TableName: customersTableName,
      Item: {...customer, shop, customerId: customer.id}
    }

    const response = await DynamoDB.put(params)
    Log.info(`Customer data is created`, {params, response: response.Item})
    return response.Item; 
  } else {
    return null;
  }
}


const routes = {
  onCreate,
}
module.exports = {
  API: {
    CUSTOMER_ID: "customer_id",
    ID: "id",
    EMAIL: "email",
    FIRST_NAME: "first_name",
    LAST_NAME: "last_name",
    ORDERS_COUNT: "orders_count",
    STATE: "state",
    TOTAL_SPENT: "total_spent",
    LAST_ORDER_ID: "last_order_id",
    NOTE: "note",
    VERIFIED_EMAIL: "verified_email",
    MULTIPASS_IDENTIFIER: "multipass_identifier",
    TAX_EXEMPT: "tax_exempt",
    PHONE: "phone",
    LAST_ORDER_NAME: "last_order_name",
    CURRENCY: "currency",
    ADMIN_GRAPHQL_API_ID: "admin_graphql_api_id",
    DEFAULT_ADDRESS: "default_address",
    "default_address": {
      
    }
  },
  ...routes
}

/**
 * 
 * 
      "phone": "+16136120707",
      "tags": "",
      "last_order_name": "#1001",
      "currency": "USD",
      "accepts_marketing_updated_at": "2005-06-12T11:57:11-04:00",
      "marketing_opt_in_level": null,
      "tax_exemptions": [],
      "admin_graphql_api_id": "gid://shopify/Customer/207119551",
      "default_address": {
        "id": 207119551,
        "customer_id": 207119551,
        "first_name": null,
        "last_name": null,
        "company": null,
        "address1": "Chestnut Street 92",
        "address2": "",
        "city": "Louisville",
        "province": "Kentucky",
        "country": "United States",
        "zip": "40202",
        "phone": "555-625-1199",
        "name": "",
        "province_code": "KY",
        "country_code": "US",
        "country_name": "United States",
        "default": true
      }
    }
 */