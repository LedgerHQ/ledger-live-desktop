// @flow

export default (name: string) => {
  const C = function CustomError(message?: string, fields?: Object) {
    this.name = name
    this.message = message || name
    this.stack = new Error().stack
    Object.assign(this, fields)
  }
  // $FlowFixMe
  C.prototype = new Error()
  return C
}
