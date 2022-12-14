import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../../models/User';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => '/api/user',
      providesTags: ['User']
    }),
    addContact: builder.mutation({
      query: (contact) => ({
        url: '/api/user/contacts/',
        method: 'POST',
        body: JSON.stringify(contact)
      }),
      invalidatesTags: ['User']
    })
  })
});

export const { useGetUserQuery, useAddContactMutation } = apiSlice;
