const cdk = require("@aws-cdk/core");

const ShopifyDBConstruct = require("../construct/shopify-db");
const ShopifyKinesisConstruct = require("../construct/shopify-kinesis");
class ShopifyOrderStreamStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */

  constructor(scope, id, props) {
    super(scope, id, props);

    const app = this.node.root;

    // add the order stack
    const db = new ShopifyDBConstruct(this, props.env.stage + "-shopify", {
      resourceStage: props.env.resourceStage,
    });
    new ShopifyKinesisConstruct(this, id, {
      ...db,
      resourceStage: props.env.resourceStage,
    });
  }
}

module.exports = { ShopifyOrderStreamStack };
