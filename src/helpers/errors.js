// @flow
/* eslint-disable no-continue */

// TODO we need to centralize the error in one place. so all are recorded
const errorClasses = {}

export const createCustomErrorClass = (name: string): Class<any> => {
  const C = function CustomError(message?: string, fields?: Object) {
    this.name = name
    this.message = message || name
    this.stack = new Error().stack
    Object.assign(this, fields)
  }
  // $FlowFixMe
  C.prototype = new Error()

  errorClasses[name] = C
  // $FlowFixMe we can't easily type a subset of Error for now...
  return C
}

// inspired from https://github.com/programble/errio/blob/master/index.js
export const deserializeError = (object: mixed): Error => {
  if (typeof object === 'object' && object) {
    try {
      // $FlowFixMe FIXME HACK
      const msg = JSON.parse(object.message)
      if (msg.message && msg.name) {
        object = msg
      }
    } catch (e) {
      // nothing
    }
    const constructor =
      object.name === 'Error'
        ? Error
        : typeof object.name === 'string'
          ? errorClasses[object.name] || createCustomErrorClass(object.name)
          : Error

    const error = Object.create(constructor.prototype)
    for (const prop in object) {
      if (object.hasOwnProperty(prop)) {
        error[prop] = object[prop]
      }
    }
    if (!error.stack && Error.captureStackTrace) {
      Error.captureStackTrace(error, deserializeError)
    }
    return error
  }
  return new Error(String(object))
}

// inspired from https://github.com/sindresorhus/serialize-error/blob/master/index.js
export const serializeError = (value: mixed) => {
  if (!value) return value
  if (typeof value === 'object') {
    return destroyCircular(value, [])
  }
  if (typeof value === 'function') {
    return `[Function: ${value.name || 'anonymous'}]`
  }
  return value
}

// https://www.npmjs.com/package/destroy-circular
function destroyCircular(from: Object, seen) {
  const to = {}
  seen.push(from)
  for (const key of Object.keys(from)) {
    const value = from[key]
    if (typeof value === 'function') {
      continue
    }
    if (!value || typeof value !== 'object') {
      to[key] = value
      continue
    }
    if (seen.indexOf(from[key]) === -1) {
      to[key] = destroyCircular(from[key], seen.slice(0))
      continue
    }
    to[key] = '[Circular]'
  }
  if (typeof from.name === 'string') {
    to.name = from.name
  }
  if (typeof from.message === 'string') {
    to.message = from.message
  }
  if (typeof from.stack === 'string') {
    to.stack = from.stack
  }
  return to
}
