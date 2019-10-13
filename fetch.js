const http = require('http')

exports.fetch = url => {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let str = ''
      res.on('data', chunk => { str += chunk })
      res.on('end', () => { resolve(str) })
      res.on('error', err => { reject(err) })
    })
  })
}
