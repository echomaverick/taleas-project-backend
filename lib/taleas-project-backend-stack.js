const { Stack, Duration } = require('aws-cdk-lib');
// const sqs = require('aws-cdk-lib/aws-sqs');
const {NodejsFunction} = require('aws-cdk-lib/aws-lambda-nodejs')
const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const path = require("path");


class TaleasProjectBackendStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const createUser = new NodejsFunction(this, "createUser", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, "../resources/handlers/userHandlers/createUser.js"),
      handler: "createUser",
    });

    const profileComplete = new NodejsFunction(this, "profileComplete", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, "../resources/handlers/userHandlers/profileCompleted.js"),
      handler: "profileComplete",
    });

    
    const api = new apigateway.RestApi(this, "lambdacdk-api", {
      restApiName: "apricus",
      description: "Deploy using aws cdk",
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE"],
        allowHeaders: ["Authorization"],
      },
    });

    const user = new apigateway.Resource(this, "UserResource", {
      parent: api.root,
      pathPart: "user",
    });

    const commpleteProfile = new apigateway.Resource(this, "UpdateProfileResource", {
      parent: api.root,
      pathPart: "{email}",
    });
    user.addMethod('POST', new apigateway.LambdaIntegration(createUser));
    commpleteProfile.addMethod('PUT', new apigateway.LambdaIntegration(profileComplete));


    const createEmployer = new NodejsFunction(this, "createEmployer", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, "../resources/handlers/employerHandlers/createEmployer.js"),
      handler: "createEmployer",
    });

    const employer = new apigateway.Resource(this, "EmployerResource", {
      parent: api.root,
      pathPart: "employer",
    });
    employer.addMethod("POST", new apigateway.LambdaIntegration(createEmployer));
  }
}

module.exports = { TaleasProjectBackendStack }