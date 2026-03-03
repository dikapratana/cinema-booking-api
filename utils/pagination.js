function buildPagination({ page = 1, size = 1, totalData = 0, totalDataOnPage = 0 }) {
  const totalPage = Math.ceil(totalData / size);

  return {
    page,
    size,
    totalPage,
    totalDataOnPage,
    totalData,
  }
}

module.exports = {
  buildPagination,
}