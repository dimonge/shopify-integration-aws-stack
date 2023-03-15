const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const ShopifyOrderStream = require('../lib/shopify-order-stream-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new ShopifyOrderStream.ShopifyOrderStreamStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
