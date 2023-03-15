const Core = require("@aws-cdk/core");
const lambda = require("@aws-cdk/aws-lambda");
const kinesis = require("@aws-cdk/aws-kinesis");
const KinesisEventSource = require("@aws-cdk/aws-lambda-event-sources").KinesisEventSource;
const path = require("path");
class ShopifyKinesis extends Core.Construct {
  constructor(scope, id, props) {
    super(scope, id, props);
    const resourceStage = props.resourceStage;

    const ordersKinesisStream = new kinesis.Stream(this, "orderStream", {
      streamName: `${resourceStage}-orderEventsStream`,
    });
    // consumer
    const saveOrdertoDBLambda = new lambda.Function(this, "saveOrderToDb", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "saveOrderToDb.handler",
      code: lambda.Code.fromAsset("functions"),
      environment: {
        orderEventsStream: ordersKinesisStream.streamName,
        ordersTable: props.ordersTable.tableName,
        customersTable: props.customersTable.tableName,
        addressesTable: props.addressesTable.tableName,
      },
    });
    
    saveOrdertoDBLambda.addEventSource(
      new KinesisEventSource(ordersKinesisStream, {
        batchSize: 100,
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      })
    );

    props.ordersTable.grantFullAccess(saveOrdertoDBLambda);
    props.customersTable.grantFullAccess(saveOrdertoDBLambda);
    props.addressesTable.grantFullAccess(saveOrdertoDBLambda);
  }
}

module.exports = ShopifyKinesis;
