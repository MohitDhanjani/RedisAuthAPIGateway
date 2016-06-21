var redis = require('redis');
var Promise = require('bluebird');

Promise.promisifyAll(redis.RedisClient.prototype);

const REDIS_PORT = "16142";
const REDIS_HOST = "my-redis-host.redis.io";
const REDIS_PASSWORD = ""; //Keep blank if no password required.

//POLICY
//Please put your policy in this variable!
var policyDocument =  {
    "Version": "2012-10-17",
    "Statement": [
        {
        "Effect": "Allow",
        "Action": [
            "execute-api:Invoke"
        ],
        "Resource": [
            "arn:aws:execute-api:*"
        ]
        }
    ]
}


//DO NOT put any value here!
var principalId;
var client;

var connectToRedis = function (){
    
    return new Promise(function (resolve, reject){
        
        client = redis.createClient({port:REDIS_HOST, host:REDIS_HOST});
        
        if(REDIS_PASSWORD){
            client.auth(REDIS_PASSWORD);
        }
        
        client.on("error", function(err){
            reject(new Error("Unable to connect to redis")); 
        });

        client.on("connect", function(){
            resolve();
        });
    });
}

var checkAuthentication =  function(accessToken) {
    return new Promise(function(resolve, reject){
        connectToRedis().then(function(){
            client.getAsync(accessToken).then(function(data){
                if(!data){
                    reject(new Error("Unauthorized"));
                }
                else {
                    principalId = data;
                    resolve(principalId);   
                }
                closeConnection();
            }).catch(function (err){
                reject(new Error("Unauthorized"));
            }); 
        }); 
        
    });
     
}

var getAuthentication = function(pincipalId) {
    return new Promise(function(resolve, reject){
       resolve({
            principalId : principalId,
            policyDocument : policyDocument
        }); 
    }) 
}

var getToken = function( params ) {
    
    return new Promise(function(resolve, reject){
        var token;
        
        if ( ! params.type || params.type !== 'TOKEN' ) {
            throw new Error( "Expected 'event.type' parameter to have value TOKEN" );
        }

        var tokenString = params.authorizationToken;
        if ( !tokenString ) {
            throw new Error( "Expected 'event.authorizationToken' parameter to be set" );
        }
        
        var match = tokenString.match( /^Bearer (.*)$/ );
        if ( ! match || match.length < 2 ) {
            throw new Error( "Invalid Authorization token - '" + tokenString + "' does not match 'Bearer .*'" );
        }
        resolve(match[1]);
    });
    
}


var closeConnection = function (){
    client.quit();
}


module.exports.handler = function (event, context) {
    
    getToken(event).then(checkAuthentication).then(getAuthentication).then(function(data){
        context.succeed(data);
    }).catch(function (err){
        if(err.message == "Unauthorized")
        {
            console.log("Cannot login. " + err.message);
            context.fail("Unauthorized");
        }
        else {
            console.log("Some other error occured - " + err.message);
            context.fail("error");
        }
    })
};