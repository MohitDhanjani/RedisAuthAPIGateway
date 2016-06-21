# RedisAuthAPIGateway

## What is it for?
If are using... 
1. API Gateway's Custom Authorizer.
2. Redis to store the access Token of users as Key.

This Lambda function will quickly let you configure your Redis as authentication layer for API Gateway.

## Get Started

1. Download zip or clone this repo. Go to directory and run `npm install` to install all modules.
2. Open `index.js` file and change the value of REDIS_PORT, REDIS_HOST and REDIS_PASSWORD to your particular Redis configuration.
3. Change the `policyDocument` variable's value to the policy document according to you.
4. Zip the contents of the folder. **NOT the folder itself**.
5. Upload it on AWS Lambda. Default settings will do. Handler name **need** to be `index.handler`. Config your API Gateway to use the function.

## Tell me more...

Tokens are used for authenticating the users. Sent in the Authorization header, if you happen to be storing those Tokens as Key in your Redis and the user ID/details as values to make things fast, and you want to secure your API via this, then this function can help.
This function will help you secure your API hosted on API Gateway via its Custom Authorizer feature and your Redis authentication layer.

## Is this approach secure?

I cannot be sure. I was experimenting with different login approaches for my new project. This is the result of that experiment.
But it surely is fast (not faster than JWT - JSON Web Tokens, though). It is faster than AWS DynamoDB in first run and also faster in fetching the items subsequent times. (Given that DynamoDB and Redis are hosted in same region as the Lambda function).

NOTE - Redis didn't work for me. Currently I am experimenting with Auth0 and its JWT system. JWT is super fast, secure, scalable, and cost effective solution. But experiments go on!

### Feedback/Bugs

If you have any feedback regarding this approach or have come accross any issues or bugs. Please file them in Issue tracker.