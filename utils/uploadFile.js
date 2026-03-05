const fs = require('fs')
const path = require('path')

function isLocalUploadPath(fileUrl) {
  return typeof fileUrl === 'string' && fileUrl.startsWith('/uploads/')
}

async function replaceLocalUpload(previousUrl, nextUrl) {
  const shouldDeletePrevious =
    typeof nextUrl === 'string' &&
    nextUrl !== previousUrl &&
    isLocalUploadPath(previousUrl)

  if (!shouldDeletePrevious) {
    return false
  }

  const previousFilePath = path.join(process.cwd(), previousUrl.replace(/^\//, ''))
  try {
    await fs.promises.unlink(previousFilePath)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    }

    return false
  }
}

async function unlinkFile(url) {
  const previousFilePath = path.join(process.cwd(), url.replace(/^\//, ''))
  try {
    await fs.promises.unlink(previousFilePath)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    }

    return false
  }
}

module.exports = {
  isLocalUploadPath,
  replaceLocalUpload,
  unlinkFile
}
