async function paginateQuery(model, { page, size, where = {}, orderBy = {}, ...options }) {
  const skip = (page - 1) * size

  const [data, totalData] = await Promise.all([
    model.findMany({
      skip,
      take: size,
      where,
      orderBy,
      ...options
    }),
    model.count({ where })
  ])

  const totalPage = Math.ceil(totalData / size)

  return {
    data,
    meta: {
      page,
      size,
      totalPage,
      totalDataOnPage: data.length,
      totalData
    }
  }
}

module.exports = paginateQuery
