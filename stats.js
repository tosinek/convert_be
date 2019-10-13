const db = require('./db.js')

const getStats = async () => {
  const data = await db.get('id', 'conversionStats', 'currencyConversionStats').catch(e => {
    console.error(e)
    throw new Error('DB connection problem')
  })
  console.log('stats:', data)
  return data
}

const addToStats = async ({ targetCurrency, amountInUsd }) => {
  const currentStats = await getStats().catch(e => {
    console.error(e)
    throw new Error('DB connection problem')
  })

  currentStats.conversionCount++
  currentStats.conversionAmountInUsd += amountInUsd
  if (!currentStats.destinationCurrencies[targetCurrency]) currentStats.destinationCurrencies[targetCurrency] = 0
  currentStats.destinationCurrencies[targetCurrency]++

  const writeResult = await db.write('conversionStats', currentStats, 'currencyConversionStats')
  console.log('after write:', writeResult) // maybe this could be used as a return value
}

exports.getStats = getStats
exports.addToStats = addToStats
