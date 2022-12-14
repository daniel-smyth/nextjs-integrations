/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Contact } from '../../models/Contact';
import { User } from '../../models/User';

export interface UserState extends User {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | undefined;
}

const initialState: UserState = {
  id: '',
  given_name: '',
  family_name: '',
  email: '',
  contacts: [],
  integrations: [],
  status: 'idle',
  error: undefined
};

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  let res: any = await fetch('http://localhost:3000/api/user', {
    method: 'GET'
  });
  if (res.status === 200) {
    const data = await res.json();
    return data;
  }
  res = await res.json();
  throw new Error(res.error);
});

export const addNewContact = createAsyncThunk(
  'user/addNewContact',
  async (contact: Contact) => {
    let res: any = await fetch('http://localhost:3000/api/user/contacts', {
      method: 'POST',
      body: JSON.stringify(contact)
    });
    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
    res = await res.json();
    throw new Error(res.error);
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUser.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => ({
        ...state,
        ...action.payload,
        status: 'succeeded'
      }))
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewContact.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(addNewContact.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contacts.push(action.payload);
      })
      .addCase(addNewContact.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const {} = userSlice.actions;

export default userSlice.reducer;
