// @flow

export default {
  loop: false,
  defaultProps: {
    open: true,
  },
  flowProps: [
    {
      timeout: 1000,
      props: {
        usb: 'plugHint',
      },
    },
    {
      timeout: 1000,
      props: {
        screen: 'pin',
      },
    },
  ],
}
