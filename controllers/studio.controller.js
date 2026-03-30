const studioService = require('../services/studio.service')
const { successResponse, errorResponse } = require('../utils/response')

function handleStudioError(res, error) {
  if (error?.code === 'P2002') {
    return errorResponse(res, {
      message: 'Studio name already exists in this cinema',
      code: 409
    })
  }

  if (error?.code === 'P2003') {
    return errorResponse(res, {
      message: 'Cinema not found',
      code: 404
    })
  }

  if (error?.code === 'STUDIO_LAYOUT_CONFLICT') {
    return errorResponse(res, {
      message: error.message,
      code: 409
    })
  }

  return errorResponse(res, { message: error?.message })
}

exports.get = async (req, res) => {
  try {
    const { data, meta } = await studioService.getStudio(req?.validated?.query)
    return successResponse(res, { message: 'Success get studios', data, meta })
  } catch (error) {
    return errorResponse(res, { message: error?.message })
  }
}

exports.create = async (req, res) => {
  try {
    const result = await studioService.createStudio(req?.validated?.body)

    return successResponse(res, { message: 'Success create studio', data: result })
  } catch (error) {
    return handleStudioError(res, error)
  }
}

exports.detail = async (req, res) => {
  try {
    const data = await studioService.detailStudio(req.validated?.params)
    if (!data) {
      return errorResponse(res, {
        message: 'Studio not found',
        code: 404
      })
    }
    return successResponse(res, {
      message: 'Success get studio detail',
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
    const data = await studioService.updateStudio(req?.validated?.params, req?.validated?.body)
    if (!data) {
      return errorResponse(res, {
        message: 'Studio not found',
        code: 404
      })
    }

    return successResponse(res, {
      message: 'Success update studio',
      data
    })
  } catch (error) {
    return handleStudioError(res, error)
  }
}

exports.delete = async (req, res) => {
  try {
    const data = await studioService.deleteStudio(req?.validated?.params)
    if (!data) {
      return errorResponse(res, {
        message: 'Studio not found',
        code: 404
      })
    }

    return successResponse(res, {
      message: 'Success delete studio'

    })
  } catch (error) {
    return errorResponse(res, { message: error?.message })
  }
}

exports.generateSeats = async (req, res) => {
  try {
    const data = await studioService.generateStudioSeats(
      req?.validated?.params,
      req?.validated?.body
    )

    if (!data) {
      return errorResponse(res, {
        message: 'Studio not found',
        code: 404
      })
    }

    return successResponse(res, {
      message: 'Success generate studio seats',
      data,
      code: 201
    })
  } catch (error) {
    return handleStudioError(res, error)
  }
}
