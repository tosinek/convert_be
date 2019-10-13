const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' })

exports.get = (key, value, table) => {
  if (!table) throw 'table needed'
  if (typeof key !== 'string') throw `key was not string and was ${JSON.stringify(key)} on table ${table}`
  if (typeof value !== 'string') throw `value was not string and was ${JSON.stringify(value)} on table ${table}`
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: { [key]: value },
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

exports.write = (ID, data, table) => {
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
      return resolve({ ...result.Attributes, ...params.Item })
    })
  })
}
