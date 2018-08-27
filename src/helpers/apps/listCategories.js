// @flow
import network from 'api/network'

import { GET_CATEGORIES } from 'helpers/urls'
import type { Category } from 'helpers/types'

export default async (): Promise<Array<Category>> => {
  const { data }: { data: Array<Category> } = await network({ method: 'GET', url: GET_CATEGORIES })
  return data.length > 0 ? data : []
}
