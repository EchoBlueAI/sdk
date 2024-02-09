import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const sampleApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/' }),
  endpoints: () => ({}),
})
