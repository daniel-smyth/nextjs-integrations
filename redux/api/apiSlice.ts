// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { Contact } from '../../models/Contact';

// export const apiSlice = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({ baseUrl: '/' }),
//   tagTypes: ['Contact'],
//   endpoints: (builder) => ({
//     getContacts: builder.query<Contact[], void>({
//       query: () => '/api/contacts',
//       providesTags: ['Contact']
//     }),
//     addContact: builder.mutation({
//       query: (contact: Contact) => ({
//         url: '/api/contacts',
//         method: 'POST',
//         body: JSON.stringify(contact)
//       }),
//       invalidatesTags: ['Contact']
//     })
//   })
// });

// export const { getContacts, addContact } = apiSlice;

export {};
