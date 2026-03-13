const seatService = require('../services/seat.service')
const { successResponse, errorResponse } = require('../utils/response')

exports.get = async (req, res) => {
  try {
    const { data, meta } = await seatService.getSeat(req?.validated?.query)
    return successResponse(res, { message: 'success get seat', data, meta })
  } catch (error) {
    return errorResponse(res, { message: error?.message })
  }
}

exports.create = async (req, res) => {
  try {
    const result = await seatService.createSeat(req?.validated?.body)

    return successResponse(res, { message: 'Success create seat', data: result })
  } catch (error) {
    if (error?.code === 'P2002') {
      return errorResponse(res, {
        message: 'Seat number already exists in this studio',
        code: 409
      })
    }

    if (error?.code === 'P2003') {
      return errorResponse(res, {
        message: 'Studio not found',
        code: 404
      })
    }

    return errorResponse(res, { message: error?.message })
  }
}

exports.detail = async (req, res) => {
  try {
    const data = await seatService.detailSeat(req.validated?.params)
    if (!data) {
      return errorResponse(res, {
        message: 'Seat not found',
        code: 404
      })
    }
    return successResponse(res, {
      message: 'Success get seat detail',
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
    const data = await seatService.updateSeat(req?.validated?.params, req?.validated?.body)
    if (!data) {
      return errorResponse(res, {
        message: 'Seat not found',
        code: 404
      })
    }

    return successResponse(res, {
      message: 'Success update seat',
      data
    })
  } catch (error) {
    if (error?.code === 'P2002') {
      return errorResponse(res, {
        message: 'Seat number already exists in this studio',
        code: 409
      })
    }
    if (error?.code === 'P2003') {
      return errorResponse(res, {
        message: 'Studio not found',
        code: 404
      })
    }
    return errorResponse(res, { message: error?.message })
  }
}

exports.delete = async (req, res) => {
  try {
    const data = await seatService.deleteSeat(req?.validated?.params)
    if (!data) {
      return errorResponse(res, {
        message: 'Seat not found',
        code: 404
      })
    }

    return successResponse(res, {
      message: 'Success delete seat'

    })
  } catch (error) {
    return errorResponse(res, { message: error?.message })
  }
}
