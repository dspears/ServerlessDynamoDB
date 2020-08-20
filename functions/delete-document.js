'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.documents_table;

async function deleteDocumentById(id) {
  let req = {
    TableName: tableName,
    Key: { "id": id },
  };

  return await dynamodb.delete(req).promise();
}

module.exports.handler = async (event) => {
  const { id } = event.pathParameters;
  await deleteDocumentById(id);
  return {
    statusCode: 204,
  }
}
