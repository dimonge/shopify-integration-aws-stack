#!/usr/bin/env bash
# cdk-deploy-to-test.sh
./cdk-deploy-to.sh xxxxxxx eu-west-1 "$@" || exit
./cdk-deploy-to.sh xxxxxxx eu-west-1 "$@"