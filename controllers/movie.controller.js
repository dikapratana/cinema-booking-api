const movieService = require('../services/movie.service')
const { successResponse, errorResponse } = require('../utils/response')

const withHostname = (req, posterUrl) => {
  if (!posterUrl) return posterUrl
  if (posterUrl.startsWith('http://') || posterUrl.startsWith('https://')) {
    return posterUrl
  }
  const forwardedProto = req.headers['x-forwarded-proto']
  const protocol = forwardedProto ? forwardedProto.split(',')[0] : req.protocol
  const host = req.get('host')
  return `${protocol}://${host}${posterUrl}`
}

exports.findAll = async (req, res) => {
  try {
    const { data, meta } = await movieService.getAllMovies(req.validated?.query)
    const normalizedData = data.map((movie) => ({
      ...movie,
      posterUrl: withHostname(req, movie.posterUrl)
    }))
    return successResponse(res, {
      message: 'Success get movies',
      data: normalizedData,
      meta
    })
  } catch (error) {
    return errorResponse(res, {
      message: error?.message || 'Internal server error',
      code: 500
    })
  }
}

exports.create = async (req, res) => {
  try {
    const movie = await movieService.createMovie(req.validated?.body)
    return successResponse(res, {
      message: 'Success create movie',
      data: movie
    })
  } catch (error) {
    return errorResponse(res, {
      message: error?.message || 'Internal server error',
      code: 500
    })
  }
}
