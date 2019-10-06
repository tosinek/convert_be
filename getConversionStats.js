const AWS = require('aws-sdk')
const Lambda = new AWS.Lambda()

exports.handler = async () => {
  const dynamoResponse = await Lambda.invoke({ FunctionName: 'dynamoDBfetcher' }).promise()
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(dynamoResponse.Payload), // todo here could be the JSON.parse()
  }
}
