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

const normalizeMoviePoster = (req, movie) => ({
  ...movie,
  posterUrl: withHostname(req, movie.posterUrl)
})

function handleStudioError(res, error) {
  if (error?.code === 'P2003') {
    return errorResponse(res, {
      message: 'Genre not found',
      code: 404
    })
  }

  return errorResponse(res, { message: error?.message })
}

exports.findAll = async (req, res) => {
  try {
    const { data, meta } = await movieService.getAllMovies(req.validated?.query)
    const normalizedData = data.map((movie) => normalizeMoviePoster(req, movie))
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
      data: normalizeMoviePoster(req, movie)
    })
  } catch (error) {
    return handleStudioError(res, error)
  }
}

exports.detail = async (req, res) => {
  try {
    const movie = await movieService.detailMovie(req.validated?.params)
    if (!movie) {
      return errorResponse(res, {
        message: 'Movie not found',
        code: 404
      })
    }
    return successResponse(res, {
      message: 'Success get movie detail',
      data: normalizeMoviePoster(req, movie)
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
    const movie = await movieService.updateMovie(req.validated?.params, req.validated?.body)
    if (!movie) {
      return errorResponse(res, {
        message: 'Movie not found',
        code: 404
      })
    }
    return successResponse(res, {
      message: 'Success update movie',
      data: normalizeMoviePoster(req, movie)
    })
  } catch (error) {
    return handleStudioError(res, error)
  }
}

exports.delete = async (req, res) => {
  try {
    const result = await movieService.deleteMovie(req.validated?.params)
    if (!result) {
      return errorResponse(res, {
        message: 'Movie not found',
        code: 404
      })
    }
    return successResponse(res, {
      message: 'Success delete movie'
    })
  } catch (error) {
    return errorResponse(res, {
      message: error?.message || 'Internal server error',
      code: 500
    })
  }
}
