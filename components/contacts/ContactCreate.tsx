import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import Alert, { AlertColor } from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { addNewContact } from '../../redux/slices/userSlice';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { Contact } from '../../models/Contact';

export default function ContactCreate() {
  const [result, setResult] = useState<{ type: string; message: string }>();
  const { user } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

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
      await dispatch(addNewContact(newContact)).unwrap();
      setResult({ type: 'success', message: 'New contact created' });
    } catch (err: any) {
      console.log(err.message); // eslint-disable-line no-console
      setResult({ type: 'error', message: err.message });
    }
  };

  return (
    <form onSubmit={contactForm.handleSubmit(addContact)}>
      <Stack spacing={4}>
        {Object.keys(user?.contacts[0] || {}).map((field) => (
          <React.Fragment key={field}>
            <TextField
              {...contactForm.register(field as keyof Contact, {
                required: true,
                minLength: 1
              })}
              label={field}
              fullWidth
              id={`new-contact-${field}`}
            />
            {contactForm.formState.errors[field as keyof Contact] && (
              <Alert severity="warning">
                {contactForm.formState.errors[field as keyof Contact]!.message}
              </Alert>
            )}
          </React.Fragment>
        ))}
        <Collapse in={!!result}>
          <Alert
            severity={result?.type as AlertColor}
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={() => setResult(undefined)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <strong id="integration-create-result">{result?.message}</strong>
          </Alert>
        </Collapse>
        <Button
          type="submit"
          variant="contained"
          disabled={user.status === 'loading'}
        >
          {user.status === 'loading' ? 'Adding Contact...' : 'Create Contact'}
        </Button>
      </Stack>
    </form>
  );
}
