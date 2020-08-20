'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.documents_table;

async function getDocuments() {
  let req = {
    TableName: tableName,
  };

  let resp = await dynamodb.scan(req).promise();
  return resp.Items;
}

module.exports.handler = async (event) => {
  let results = await getDocuments();
  return {
    statusCode: 200,
    body: JSON.stringify(results),
  }
}
