import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '<<API_URL_TO_PATCH>>' }),
  endpoints: () => ({}),
})
