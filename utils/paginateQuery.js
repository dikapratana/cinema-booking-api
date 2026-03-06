async function paginateQuery(model, { page, size, where = {}, orderBy = {} }) {
  const skip = (page - 1) * size

  const [data, totalData] = await Promise.all([
    model.findMany({
      skip,
      take: size,
      where,
      orderBy
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
