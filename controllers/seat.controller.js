const seatService = require('../services/seat.service')
const { successResponse, errorResponse } = require('../utils/response')

exports.get = async (req, res) => {
  try {
    const { data, meta } = await seatService.getSeat(req?.validated?.query)
    return successResponse(res, { message: 'Success get seats', data, meta })
  } catch (error) {
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
