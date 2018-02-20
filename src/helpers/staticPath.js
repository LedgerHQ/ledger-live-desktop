const isStorybook = process.env.STORYBOOK_ENV
const isRunningInAsar = !isStorybook && process.mainModule.filename.indexOf('app.asar') !== -1

export default (__DEV__ && !isStorybook
  ? __static
  : isRunningInAsar
    ? __dirname.replace(/app\.asar$/, 'static')
    : !isStorybook ? `${__dirname}/../static` : 'static')
