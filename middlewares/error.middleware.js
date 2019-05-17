module.exports.errorHandling = (req, res) => {
  res.status(404).json({ message: 'Not Found' })
}