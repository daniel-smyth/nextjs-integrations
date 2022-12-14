import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useUser } from '../../context/UserContext';
import { Contact } from '../../models/Contact';

export default function ContactCreate() {
  const { user, updateUser } = useUser();
  const [uploading, setUploading] = useState(false);

  const getSchema = () =>
    Yup.lazy((obj) => {
      const schema: any = {};

      Object.keys(obj).forEach((key) => {
        if (key === 'email') schema[key] = Yup.string().required().email();
        else schema[key] = Yup.string().required();
      });

      return Yup.object(schema);
    });

  const contactForm = useForm<Contact>({
    defaultValues: { ...user?.contacts[0] },
    resolver: yupResolver(getSchema())
  });

  const addContact = async (newContact: Contact) => {
    try {
      setUploading(true);

      if (user) {
        user.contacts.push(newContact);
        await updateUser(user);
      }
    } catch (err: any) {
      console.log(err.message); // eslint-disable-line no-console
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <form onSubmit={contactForm.handleSubmit(addContact)}>
      <Stack spacing={4}>
        {Object.keys(user?.contacts[0] || {}).map((field) => (
          <>
            <TextField
              {...contactForm.register(field as keyof Contact, {
                required: true,
                minLength: 1
              })}
              label={field}
              fullWidth
              id={`new-contact-${field}`}
              key={field}
            />
            {contactForm.formState.errors[field as keyof Contact] && (
              <Alert severity="warning">
                {contactForm.formState.errors[field as keyof Contact]!.message}
              </Alert>
            )}
          </>
        ))}
        <Button type="submit" variant="contained" disabled={uploading}>
          {uploading ? 'Adding Contact...' : 'Create Contact'}
        </Button>
      </Stack>
    </form>
  );
}
