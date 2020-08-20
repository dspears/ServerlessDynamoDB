'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.documents_table;

async function postDocument(document) {
  let req = {
    TableName: tableName,
    Item: document,
  };

  return await dynamodb.put(req).promise();
}

function validate(req) {
  if (!(req.id && req.id.length > 0)) {
    return { isValid: false, errorMessage: "The id field is required in document meta data" };
  }
  if (!(req.name && req.name.length > 0)) {
    return { isValid: false, errorMessage: "The name field is required in document meta data" };
  }
  return { isValid: true, errorMessage: "" };
}

module.exports.handler = async (event) => {
  const req = JSON.parse(event.body);
  const {isValid, errorMessage} = validate(req);
  if (isValid) {
    await postDocument(req);
    return {
      statusCode: 200,
      body: JSON.stringify({
          status: 'success',
      }),
    };
  } else {
    return {
      statusCode: 422,
      body: JSON.stringify({
        status: 'failed',
        errorMessage,
      }),
    };
  }
}
