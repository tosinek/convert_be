var AWS = require('aws-sdk')
var documentClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' })

class DB {
  get(key, value, table) {
    if (!table) throw 'table needed'
    if (typeof key !== 'string') throw `key was not string and was ${JSON.stringify(key)} on table ${table}`
    if (typeof value !== 'string') throw `value was not string and was ${JSON.stringify(value)} on table ${table}`
    return new Promise((resolve, reject) => {
      const params = {
        TableName: table,
        Key: { [key]: value }
      }
      documentClient.get(params, (err, data) => {
        if (err) {
          console.log(`There was an error fetching the data for ${key} ${value} on table ${table}`, err)
          return reject(err)
        }
        return resolve(data.Item)
      })
    })
  }

  write(ID, data, table) {
    return new Promise((resolve, reject) => {
      if (typeof ID !== 'string') throw `the id must be a string and not ${ID}`
      if (!data) throw "data is needed"
      if (!table) throw 'table name is needed'

      const params = { TableName: table, Item: { ...data, ID: ID } }

      documentClient.put(params, (err, result) => {
        if (err) {
          console.log("Err in writeForCall writing messages to dynamo:", err)
          console.log(params)
          return reject(err)
        }
        console.log('wrote data to table', table)
        return resolve({ ...result.Attributes, ...params.Item })
      })
    })
  }
}

exports.handler = async (event, context) => {
  console.log('request', event)
  const Dynamo = new DB()
  const dynamoData = await Dynamo.get('id', 'conversionStats', 'currencyConversionStats').catch(e => e)
  console.log('stats data', dynamoData)

  // return stats
  if (event.httpMethod === 'GET') {
    return dynamoData
  }

  // save stats
  if (event.httpMethod === 'POST') {
    // check params

    event.targetCurrency
    event.usd

    if (dynamoData) {
      dynamoData.conversionCount++
      dynamoData.conversionAmountInUsd += rates.rates['USD'] * parsedAmount
      if (!dynamoData.destinationCurrencies[to]) dynamoData.destinationCurrencies[to] = 0
      dynamoData.destinationCurrencies[to]++
    }
    console.log('after update', dynamoData.Item)
  }
}
