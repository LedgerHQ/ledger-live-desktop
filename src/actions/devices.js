// eslint-disable import/prefer-default-export

export const devicesUpdate = payload => dispatch =>
  dispatch({
    type: 'DEVICES_UPDATE',
    payload,
  })

export const deviceAdd = payload => dispatch =>
  dispatch({
    type: 'DEVICE_ADD',
    payload,
  })

export const deviceRemove = payload => dispatch =>
  dispatch({
    type: 'DEVICE_REMOVE',
    payload,
  })
