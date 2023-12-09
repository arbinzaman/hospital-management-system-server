module.exports = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const key = req.query.key || null;
  const value = req.query.value || null;

  const startIndex = (page - 1) * limit;

  req.pagination = {
    page,
    limit,
    startIndex,
    key,
    value,
  };

  next();
}