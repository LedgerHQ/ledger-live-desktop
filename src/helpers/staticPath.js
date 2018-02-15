const isRunningInAsar = process.mainModule.filename.indexOf('app.asar') !== -1

export default (__DEV__
  ? __static
  : isRunningInAsar ? __dirname.replace(/app\.asar$/, 'static') : `${__dirname}/../static`)
