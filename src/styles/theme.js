// @flow

export const space = [0, 5, 10, 15, 20, 30, 40, 50, 70]
export const fontSizes = [8, 9, 10, 11, 13, 16, 18, 22, 32]
export const radii = [0, 4]
export const shadows = ['0 4px 8px 0 rgba(0, 0, 0, 0.03)']

export const fontFamilies = {
  'Open Sans': {
    Light: {
      weight: 300,
      style: 'normal',
    },
    Regular: {
      weight: 400,
      style: 'normal',
    },
    SemiBold: {
      weight: 600,
      style: 'normal',
    },
    Bold: {
      weight: 700,
      style: 'normal',
    },
    ExtraBold: {
      weight: 800,
      style: 'normal',
    },
  },

  'Museo Sans': {
    ExtraLight: {
      weight: 100,
      style: 'normal',
    },
    Light: {
      weight: 300,
      style: 'normal',
    },
    Regular: {
      weight: 500,
      style: 'normal',
    },
    Bold: {
      weight: 700,
      style: 'normal',
    },
    ExtraBold: {
      weight: 900,
      style: 'normal',
    },
  },

  Rubik: {
    Regular: {
      weight: 500,
      style: 'normal',
    },
  },
}

export const colors = {
  transparent: 'transparent',

  argile: '#ff0000',
  mouse: '#ff0000',
  pearl: '#ff0000',

  // new colors
  identity: '#41ccb4',
  wallet: '#4b84ff',
  positiveGreen: '#96d071',
  alertRed: '#fa4352',
  black: '#000000',
  dark: '#1d2028',
  smoke: '#666666',
  graphite: '#767676',
  grey: '#999999',
  fog: '#d8d8d8',
  lightGrey: '#f9f9f9',
  white: '#ffffff',
}

export default {
  sizes: {
    topBarHeight: 58,
    sideBarWidth: 230,
  },
  radii,
  fontFamilies,
  fontSizes,
  space,
  shadows,
  colors,
}
