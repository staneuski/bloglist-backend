const errorHandler = (error, request, response, next) => { // eslint-disable-line no-unused-vars
  console.error(error.message)

  if (error.name === 'CastError')
    return response.status(400).send({ error: 'malformatted id' })
  else if (error.name === 'ValidationError')
    return response.status(400).json({ error: error.message })
  else if (error.name ===  'JsonWebTokenError')
    return response.status(401).json({ error: error.message })

  next(error)
}

const tokenExtractor = (request, response, next) => { // eslint-disable-line no-unused-vars
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer '))
    request.token = authorization.replace('Bearer ', '')

  next()
}

const unknownEndpoint = (request, response) => { // eslint-disable-line no-unused-vars
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = { errorHandler, tokenExtractor, unknownEndpoint }