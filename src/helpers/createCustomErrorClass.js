// @flow

export default (name: string): Class<any> => {
  const C = function CustomError(message?: string, fields?: Object) {
    this.name = name
    this.message = message || name
    this.stack = new Error().stack
    Object.assign(this, fields)
  }
  // $FlowFixMe
  C.prototype = new Error()
  // $FlowFixMe we can't easily type a subset of Error for now...
  return C
}
