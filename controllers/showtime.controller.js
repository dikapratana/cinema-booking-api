const showTimeService = require('../services/showtime.service')
const { successResponse, errorResponse } = require('../utils/response')

function getForeignKeyMessage(error) {
  if (error?.code === 'RELATION_NOT_FOUND') {
    return error.message
  }

  if (error?.code !== 'P2003') {
    return null
  }

  const fieldName = String(error?.meta?.field_name || '')

  if (fieldName.includes('movieId')) {
    return 'Movie not found'
  }

  if (fieldName.includes('studioId')) {
    return 'Studio not found'
  }

  return 'Related data not found'
}

function getConflictMessage(error) {
  if (error?.code === 'SHOWTIME_CONFLICT') {
    return error.message
  }

  return null
}

function handleShowtimeError(res, error) {
  const foreignKeyMessage = getForeignKeyMessage(error)
  const conflictMessage = getConflictMessage(error)

  if (foreignKeyMessage) {
    return errorResponse(res, {
      message: foreignKeyMessage,
      code: 404
    })
  }

  if (conflictMessage) {
    return errorResponse(res, {
      message: conflictMessage,
      code: 409
    })
  }

  return errorResponse(res, { message: error?.message })
}

exports.get = async (req, res) => {
  try {
    const { data, meta } = await showTimeService.getShowTime(req?.validated?.query)
    return successResponse(res, { message: 'success get showtime', data, meta })
  } catch (error) {
    return errorResponse(res, { message: error?.message })
  }
}

exports.create = async (req, res) => {
  try {
    const data = await showTimeService.createShowTime(req?.validated?.body)
    return successResponse(res, { message: 'Success create showtime', data })
  } catch (error) {
    return handleShowtimeError(res, error)
  }
}

exports.detail = async (req, res) => {
  try {
    const data = await showTimeService.detailShowTime(req.validated?.params)
    if (!data) {
      return errorResponse(res, {
        message: 'Schedule not found',
        code: 404
      })
    }
    return successResponse(res, {
      message: 'Success get schedule detail',
      data
    })
  } catch (error) {
    return errorResponse(res, {
      message: error?.message || 'Internal server error',
      code: 500
    })
  }
}

exports.update = async (req, res) => {
  try {
    const data = await showTimeService.updateShowTime(req?.validated?.params, req?.validated?.body)
    if (!data) {
      return errorResponse(res, {
        message: 'Schedule not found',
        code: 404
      })
    }

    return successResponse(res, {
      message: 'Success update schedule',
      data
    })
  } catch (error) {
    return handleShowtimeError(res, error)
  }
}

exports.delete = async (req, res) => {
  try {
    const data = await showTimeService.deleteShowTime(req?.validated?.params)
    if (!data) {
      return errorResponse(res, {
        message: 'Schedule not found',
        code: 404
      })
    }

    return successResponse(res, {
      message: 'Success delete schedule'

    })
  } catch (error) {
    return errorResponse(res, { message: error?.message })
  }
}
