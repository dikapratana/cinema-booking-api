const studioService = require('../services/studio.service')
const { successResponse, errorResponse } = require('../utils/response')

exports.get = async (req, res) => {
  try {
    const { data, meta } = await studioService.getStudio(req?.validated?.query)
    return successResponse(res, { message: 'success get cinema', data, meta })
  } catch (error) {
    return errorResponse(res, { message: error?.message })
  }
}

exports.create = async (req, res) => {
  try {
    const result = await studioService.createStudio(req?.validated?.body)

    return successResponse(res, { message: 'Success create studio', data: result })
  } catch (error) {
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

    return errorResponse(res, { message: error?.message })
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
    return errorResponse(res, { message: error?.message })
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
