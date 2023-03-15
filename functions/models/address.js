const Log = require("@modeliver_admin/sls-utils").LOG
const DynamoDB = require("@modeliver_admin/sls-utils").DYNAMO_DB


const addressesTableName = process.env.addressesTable

const onCreate = async (payload) => {
  let address = payload.customer
  if (payload && payload.customer) {
    address = payload.customer.default_address;

    const params = {
      TableName: addressesTableName,
      Item: {...address, customerId: address.customer_id, addressId: address.id}
    }

    const response = await DynamoDB.put(params)
    Log.info(`Address data is created`, {params, response: response.Item})
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
    ID: "id",
    CUSTOMER_ID: "customer_id",
    FIRST_NAME: "first_name",
    LAST_NAME: "last_name",
    COMPANY: "company",
    ADDRESS_1: "address1",
    ADDRESS_2: "address2",
    CITY: "city",
    PROVINCE: "province",
    COUNTRY: "country",
    ZIP: "zip",
    PHONE: "phone",
    NAME: "name",
    PROVINCE_CODE: "province_code",
    COUNTRY_CODE: "country_code",
    COUNTRY_NAME: "country_name",
    DEFAULT: "default"
  },
  ...routes
}