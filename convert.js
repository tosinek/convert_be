const { fetch } = require('./fetch.js')
const { addToStats } = require('./stats.js')

exports.convert = async (params) => {
  const { from, to, amount } = params

  // check arguments
  if (!from || !to || !amount) throw new Error('invalid input arguments')
  const parsedAmount = parseFloat(amount)
  if (isNaN(parsedAmount) || parsedAmount < 0) throw new Error('invalid amount')
  if (from !== 'EUR') throw new Error('free plan allows only conversion from EUR')

  // call fixer API
  const fixerReply = await fetch('http://data.fixer.io/api/latest?access_key=11e71290875f5b9fb0c096eaa6735c93&format=1').catch(e => e)
  console.log('fixer:', fixerReply)

  const rates = JSON.parse(fixerReply)
  const exchRate = rates.rates[to]
  if (!exchRate) throw new Error('invalid target currency code')

  // calculate
  const result = parsedAmount * exchRate
  console.log('parsedAmount:', parsedAmount)
  console.log('exchRate:', exchRate)

  // ideally, this should not await, but then the client rarely gets the new stats
  await addToStats({
    amountInUsd: rates.rates['USD'] * parsedAmount,
    targetCurrency: to,
  })

  return result
}
