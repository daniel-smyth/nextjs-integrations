import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../../models/User';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['User', 'Contact'],
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => '/api/user',
      providesTags: ['User']
    }),
    getContacts: builder.query({
      query: () => '/api/user/contacts',
      providesTags: (error, arg, result = []) => [
        'Contact',
        ...result.map(({ email }: { email: string }) => ({
          type: 'Contact',
          id: email
        }))
      ]
    }),
    getContact: builder.query({
      query: (email) => `/api/user/contacts/${email}`,
      providesTags: (result, error, email) => [{ type: 'Contact', id: email }]
    }),
    addContact: builder.mutation({
      query: (contact) => ({
        url: '/api/user/contacts',
        method: 'POST',
        body: JSON.stringify(contact)
      }),
      invalidatesTags: ['Contact']
    }),
    editContact: builder.mutation({
      query: (contact) => ({
        url: `/api/user/contacts/${contact.email}`,
        method: 'DELETE',
        body: JSON.stringify(contact)
      }),
      invalidatesTags: (result, error, contact) => [
        { type: 'Contact', id: contact.email }
      ]
    })
  })
});

export const { useGetUserQuery, useAddContactMutation } = apiSlice;
