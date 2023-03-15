const cdk = require("@aws-cdk/core");
const dynamodb = require("@aws-cdk/aws-dynamodb");

class ShopifyDBConstruct extends cdk.Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const stage = props.resourceStage;
    const isDevStage = stage === "dev";
    const removalPolicy = isDevStage ? cdk.RemovalPolicy.DESTROY : cdk.RemovalPolicy.RETAIN;

    this.ordersTable = new dynamodb.Table(this, "orders", {
      partitionKey: { name: "shop", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "orderId", type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy,
    });

    this.customersTable = new dynamodb.Table(this, "customers", {
      partitionKey: { name: "shop", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "customerId", type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy,
    });

    this.addressesTable = new dynamodb.Table(this, "addresses", {
      partitionKey: { name: "customerId", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "addressId", type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy,
    });

    this.gdprRequestTable = new dynamodb.Table(this, "gdprRequestTable", {
      partitionKey: { name: "shop", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy,
    });

    new cdk.CfnOutput(this, "GdprRequestTable", {
      value: this.gdprRequestTable.tableName,
      exportName: stage + "-ExtGdprRequestTable",
    });

    new cdk.CfnOutput(this, "GdprRequestTableArn", {
      value: this.gdprRequestTable.tableArn,
      exportName: stage + "-ExtGdprRequestArn",
    });

    new cdk.CfnOutput(this, "OrdersTable", {
      value: this.ordersTable.tableName,
      exportName: stage + "-ExtOrdersTable",
    });

    new cdk.CfnOutput(this, "CustomersTable", {
      value: this.customersTable.tableName,
      exportName: stage + "-ExtCustomersTable",
    });

    new cdk.CfnOutput(this, "AddressesTable", {
      value: this.addressesTable.tableName,
      exportName: stage + "-ExtAddressesTable",
    });

    new cdk.CfnOutput(this, "OrdersArn", {
      value: this.ordersTable.tableArn,
      exportName: stage + "-ExtOrdersArn",
    });

    new cdk.CfnOutput(this, "OrdersStreamArn", {
      value: this.ordersTable.tableStreamArn,
      exportName: stage + "-ExtOrdersStreamArn",
    });

    new cdk.CfnOutput(this, "CustomersArn", {
      value: this.customersTable.tableArn,
      exportName: stage + "-ExtCustomersArn",
    });

    new cdk.CfnOutput(this, "AddressesArn", {
      value: this.addressesTable.tableArn,
      exportName: stage + "-ExtAddressesArn",
    });
    
  }
}

module.exports = ShopifyDBConstruct;
