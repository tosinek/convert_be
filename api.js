import http from 'http'

exports.handler = async (event, context) => {
  const { from, to, amount } = event.queryStringParameters

  // check arguments
  if (!from || !to || !amount) respond(400, 'invalid input arguments')
  const parsedAmount = parseFloat(amount)
  if (isNaN(parsedAmount) || parsedAmount < 0) respond(400, 'invalid amount')
  if (from !== 'EUR') respond(400, 'free plan allows only conversion from EUR')

  // call fixer API
  const fixerReply = await http.get('http://data.fixer.io/api/latest?access_key=11e71290875f5b9fb0c096eaa6735c93&format=1')
  const exchRate = fixerReply.rates['to']
  if (!exchRate) respond(400, 'invalid target currency code')

  // calculate
  const result = parsedAmount * exchRate

  // store data to DynamoDB


  return respond(200, result)
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
