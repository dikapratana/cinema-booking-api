const prisma = require('../config/prisma')
const paginateQuery = require('../utils/paginateQuery')
const { buildUpdatePayload, isEmptyPayload } = require('../utils/updatePayload')

async function getStudio(query) {
  return paginateQuery(prisma.studio, {
    ...query,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      cinema: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}

async function createStudio(data) {
  return await prisma.studio.create({ data })
}

async function detailStudio(params) {
  const result = await prisma.studio.findUnique({
    where: {
      id: params?.id
    }
  })

  return result
}

async function updateStudio(params, data) {
  const result = await prisma.studio.findUnique({
    where: {
      id: params?.id
    }
  })

  if (!result) {
    return null
  }

  const payload = buildUpdatePayload(data)

  if (isEmptyPayload(payload)) {
    return result
  }

  const update = await prisma.studio.update({
    where: {
      id: params?.id
    },
    data: payload
  })

  return update
}

async function deleteStudio(params) {
  const result = await prisma.studio.findUnique({
    where: {
      id: params.id
    }
  })

  if (!result) {
    return null
  }

  await prisma.studio.delete({
    where: {
      id: params.id
    }
  })

  return result
}

module.exports = {
  getStudio,
  createStudio,
  updateStudio,
  detailStudio,
  deleteStudio
}
