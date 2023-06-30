const { logEvents } = require('./logger')

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t ${req.method}\t${req.url}\t${req.headers.origin}`,
    'errLog.log'
  )
  // LOG WHOLE STACK
  console.log(err.stack)

  // determine the status
  const status = res.statusCode ? res.statusCode : 500

  // set status to what above ternary determined
  res.status(status)

  res.json({ message: err.message, isError: true })
}

module.exports = errorHandler
