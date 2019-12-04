module.exports.errorHandling = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(500).json({ message: err.message })
  } else {
    res.status(404).json({ message: 'Not Found' })
  }
}