const { reply } = require('./reply.js')
const { getStats } = require('./stats.js')
const { convert } = require('./convert.js')

exports.handler = async (event) => {
  console.log('event:', event)

  switch (event.resource) {
    case '/convert/stats': {
      return reply(200, await getStats())
    }

    case '/convert': {
      const converted = await convert(event.queryStringParameters).catch(e => {
        console.error(e)
        return e.message //reply(400, e.message) - doesn't work
        // ! i don't understand this lambda proxy magic
      })
      return reply(200, converted)
    }
  }
}
