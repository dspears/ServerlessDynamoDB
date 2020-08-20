'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.documents_table;

async function findDocumentById(id) {
  let req = {
    TableName: tableName,
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: { ":id": id },
  };

  let response = await dynamodb.query(req).promise();
  return response.Items[0];
}

module.exports.handler = async (event) => {
  const { id } = event.pathParameters;
  let results = await findDocumentById(id);
  if (results) {
    return {
      statusCode: 200,
      body: JSON.stringify(results),
    }
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({status: "Document not found."}),
    }
  }
}
