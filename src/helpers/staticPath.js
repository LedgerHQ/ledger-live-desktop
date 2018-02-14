export default (__DEV__ ? __static : __dirname.replace(/app\.asar$/, 'static'))
