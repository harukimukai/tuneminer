import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const genreApi = createApi({
  reducerPath: 'genreApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.1.139:8000' }),
  endpoints: (builder) => ({
    predictGenre: builder.mutation({
      query: (file) => {
        const formData = new FormData()
        formData.append('file', file)

        return {
          url: '/predict',
          method: 'POST',
          body: formData,
        }
      },
    }),
  }),
})

export const { usePredictGenreMutation } = genreApi
