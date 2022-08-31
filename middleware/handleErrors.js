module.exports = (error, request, response, next) => {
  console.log(error.name)
  console.log(error)
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'id format is not recognized' })
  } else {
    response.status(500).end()
  }
}
