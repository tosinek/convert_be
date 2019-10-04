const http = require('http')
var AWS = require('aws-sdk')
var dynamo = new AWS.DynamoDB.DocumentClient()

exports.handler = async (event, context) => {
  const { from, to, amount } = event.queryStringParameters

  // check arguments
  if (!from || !to || !amount) return respond(400, 'invalid input arguments')
  const parsedAmount = parseFloat(amount)
  if (isNaN(parsedAmount) || parsedAmount < 0) return respond(400, 'invalid amount')
  if (from !== 'EUR') return respond(400, 'free plan allows only conversion from EUR')

  // call fixer API
  const fixerReply = await fetch('http://data.fixer.io/api/latest?access_key=11e71290875f5b9fb0c096eaa6735c93&format=1').catch(err => err)
  console.log('fixer says:', typeof fixerReply, fixerReply)

  const rates = JSON.parse(fixerReply)
  console.log(Object.keys(rates))
  const exchRate = rates.rates[to]
  if (!exchRate) return respond(400, 'invalid target currency code')

  // calculate
  const result = parsedAmount * exchRate
  console.log('parsedAmount', parsedAmount)
  console.log('exchRate', exchRate)

  // store data to DynamoDB


  return respond(200, result)
}

const fetch = (url) => {
  return new Promise(function (resolve, reject) {
    http.get(url, (res) => {
      let str = ''
      res.on('data', chunk => {
        str += chunk
      })

      res.on('end', function () {
        console.log('data', str)
        resolve(str)


      })

      res.on('error', (err) => {
        console.log('errrorrr ftech')
        reject(err)
      })
    })
  })
}

const respond = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body)
  }
}
