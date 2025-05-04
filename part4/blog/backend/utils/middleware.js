const errorHandler = (err, req, res, next) => {
    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'Malformed ID'})
    } else if (err.name === 'ValidationError') {
        return res.status(400).send({ error: err.message })
    } 
 
}

module.exports = { errorHandler }