function buildUpdatePayload(data = {}) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  )
}

function isEmptyPayload(payload) {
  return Object.keys(payload).length === 0
}

module.exports = {
  buildUpdatePayload,
  isEmptyPayload
}
