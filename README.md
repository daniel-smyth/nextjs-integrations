# Next.js and RTK Query

| Library   | Website                                         |
| --------- | ----------------------------------------------- |
| Next.js   | https://nextjs.org/docs/                        |
| RTK Query | https://redux-toolkit.js.org/rtk-query/overview |

## Description

My sample Next.js app using Redux RTK query for data fetching and caching. Styling with MUI. For desktop and mobile.

**URL:** https://nextjs-rtkquery.vercel.app/

## RTK Query

I used RTK query in this application. It's a powerful data fetching and caching tool by Redux designed to simplify common cases for loading data. It eliminates the need to hand-write data fetching & caching logic yourself.

Configuring an `addContact` hook in `redux/slicesredux/slices/api.ts`

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

...

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Contact', 'Integration', 'UserIntegration'],
  endpoints: (builder) => ({
    ...
    addContact: builder.mutation({
      query: (contact) => ({
        url: '/api/user/contacts',
        method: 'POST',
        body: JSON.stringify(contact)
      }),
      invalidatesTags: ['Contact']
    }),
    ...
  })
});
```

Using the `useAddContactMutation` mutation hook in `components/contacts/ContactCreate.tsx`

```typescript
...

import { useAddContactMutation } from '../../redux/slices/api';
...

export default function ContactCreate() {
const [addNewContact, { isLoading }] = useAddContactMutation();

...

const addContact = async (newContact: Contact) => {
  try {
    // Call RTK mutation
    await addNewContact(newContact).unwrap();

    setResult({ type: 'success', message: 'New contact created' });
  } catch (err: any) {
    console.log(err.data.error); // eslint-disable-line no-console
    setResult({ type: 'error', message: err.data.error });
  }
};
```

## Getting Started

Setup by running `yarn` && `yarn dev`

## E2E Testing

Testing implemented with cypress.

First start Next.js server.

Run `npm run dev` or for production `npm run build` then `npm run start`

Start cypress.

Run `npm run cypress`

For headless testing.

Run `npm run cypress:headless`
