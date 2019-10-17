// @flow

const defaultProps = {
  screen: false,
  open: true,
  xOffset: -60,
  rightHint: false,
  leftHint: false,
  usb: 'plugged',
}

export default {
  loop: true,
  defaultProps,
  flowProps: [
    {
      timeout: 1200,
      props: {
        screen: 'home',
      },
    },
    {
      timeout: 1000,
      props: {
        rightHint: true,
      },
    },
    {
      timeout: 300,
      props: {
        screen: 'logo',
        rightHint: false,
      },
    },
    {
      timeout: 1000,
      props: {
        rightHint: true,
        leftHint: true,
      },
    },
    {
      timeout: 300,
      props: {
        rightHint: false,
        leftHint: false,
        screen: 'confirmation',
      },
    },
    {
      timeout: 1200,
      props: defaultProps,
    },
  ],
}
