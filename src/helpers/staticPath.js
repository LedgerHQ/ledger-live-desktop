const { NODE_ENV, STORYBOOK_ENV } = process.env

const isRunningInAsar =
  !STORYBOOK_ENV && process.mainModule && process.mainModule.filename.indexOf('app.asar') !== -1

export default (__DEV__ && !STORYBOOK_ENV && NODE_ENV !== 'test'
  ? __static
  : isRunningInAsar
    ? __dirname.replace(/app\.asar$/, 'static')
    : !STORYBOOK_ENV ? `${__dirname}/../../static` : 'static')
