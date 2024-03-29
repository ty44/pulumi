import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as apigateway from "@pulumi/aws-apigateway";
import { ulid } from 'ulid';

// global variable
const DATE = new Date().toUTCString();

// A Lambda function to invoke
const fn = new aws.lambda.CallbackFunction("fn", {
    callback: async (ev, ctx) => {
        return {
            statusCode: 200,
            body: JSON.stringify({
                cachedDate: DATE,
                date: new Date().toUTCString(),
                id: ulid()
            }),
        };
    }
})

// A REST API to route requests to HTML content and the Lambda function
const api = new apigateway.RestAPI("api", {
    routes: [
        { path: "/", localPath: "www"},
        { path: "/date", method: "GET", eventHandler: fn },
    ]
});

// The URL at which the REST API will be served.
export const url = api.url;
