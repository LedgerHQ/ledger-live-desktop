// @flow
import network from 'api/network'
import { GET_FINAL_FIRMWARE } from 'helpers/urls'

export default async (id: number) => {
  const { data } = await network({ method: 'GET', url: `${GET_FINAL_FIRMWARE}/${id}` })
  return data
}
