const cinemaService = require('../services/cinema.service')
const { successResponse, errorResponse } = require('../utils/response')

exports.create = async (req, res) => {
  try {
    const result = await cinemaService.createCinema(req?.validated?.body)
    return successResponse(res, { message: 'Success create cinema', data: result })
  } catch (error) {
    return errorResponse(res, { message: error?.message })
  }
}

exports.get = async (req, res) => {
  try {
    const { data, meta } = await cinemaService.getCinema(req?.validated?.query)
    return successResponse(res, { message: 'success get cinema', data, meta })
  } catch (error) {
    return errorResponse(res, { message: error?.message })
  }
}

exports.detail = async (req, res) => {
  try {
    const data = await cinemaService.detailCinema(req?.validated?.params)
    if (!data) {
      return errorResponse(res, {
        message: 'Cinema not found',
        code: 404
      })
    }
    return successResponse(res, { message: 'success get detail cinema', data })
  } catch (error) {
    return errorResponse(res, { message: error?.message })
  }
}

exports.update = async (req, res) => {
  try {
    const data = await cinemaService.updateCinema(req?.validated?.params, req?.validated?.body)
    if (!data) {
      return errorResponse(res, {
        message: 'Cinema not found',
        code: 404
      })
    }

    return successResponse(res, {
      message: 'Success update cinema',
      data
    })
  } catch (error) {
    return errorResponse(res, { message: error?.message })
  }
}

exports.delete = async (req, res) => {
  try {
    const data = await cinemaService.deleteCinema(req?.validated?.params)
    if (!data) {
      return errorResponse(res, {
        message: 'Cinema not found',
        code: 404
      })
    }

    return successResponse(res, {
      message: 'Success delete cinema'

    })
  } catch (error) {
    return errorResponse(res, { message: error?.message })
  }
}
