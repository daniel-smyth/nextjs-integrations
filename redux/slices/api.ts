import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Contact } from '../../models/Contact';
import { Integration } from '../../models/Integration';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Contact', 'Integration', 'UserIntegration'],
  endpoints: (builder) => ({
    getIntegrations: builder.query<Integration[], void>({
      query: () => '/api/integrations',
      providesTags: (result = []) => [
        'Integration',
        ...result.map(({ name }: { name: string }) => ({
          type: 'Integration' as const,
          id: name
        }))
      ]
    }),
    addIntegration: builder.mutation({
      query: (integration) => ({
        url: '/api/integrations',
        method: 'POST',
        body: JSON.stringify(integration)
      }),
      invalidatesTags: ['Integration']
    }),
    addUserIntegration: builder.mutation({
      query: (integration) => ({
        url: `/api/user/integrations`,
        method: 'POST',
        body: JSON.stringify(integration)
      }),
      invalidatesTags: (integration) => [
        { type: 'UserIntegration', id: integration.name }
      ]
    }),
    deleteUserIntegration: builder.mutation({
      query: (name) => ({
        url: `/api/user/integrations/${name}`,
        method: 'DELETE'
      }),
      invalidatesTags: (integration) => [
        { type: 'UserIntegration', id: integration.name }
      ]
    }),
    getContact: builder.query<Contact, string>({
      query: (email) => `/api/user/contacts/${email}`,
      providesTags: (result, error, email) => [{ type: 'Contact', id: email }]
    }),
    getContacts: builder.query<Contact[], void>({
      query: () => '/api/user/contacts',
      providesTags: (result = []) => [
        'Contact',
        ...result.map(({ email }: { email: string }) => ({
          type: 'Contact' as const,
          id: email
        }))
      ]
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
      invalidatesTags: (contact) => [{ type: 'Contact', id: contact.email }]
    })
  })
});

export const {
  useGetIntegrationsQuery,
  useAddIntegrationMutation,
  useAddUserIntegrationMutation,
  useDeleteUserIntegrationMutation,
  useGetContactQuery,
  useGetContactsQuery,
  useEditContactMutation,
  useAddContactMutation
} = apiSlice;
