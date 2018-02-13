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
  colors: {
    transparent: 'transparent',

    black: '#000000',
    white: '#ffffff',

    argile: '#eeeeee',
    blue: '#6193ff',
    cream: '#f9f9f9',
    grey: '#a8b6c2',
    green: '#a6d495',
    grenade: '#ea2e49',
    lead: '#999999',
    mouse: '#e2e2e2',
    night: '#1d2028',
    ocean: '#27d0e2',
    pearl: '#f4f4f4',
    shark: '#666666',
    steel: '#767676',

    dark: '#1d2028',
    dodgerBlue: '#4b84ff',
    paleGrey: '#f7f8fa',
    warmGrey: '#999999',
  },
}
