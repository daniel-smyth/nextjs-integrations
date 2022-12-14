import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ContactCreate from './ContactCreate';
import ContactList from './ContactList';

function ContactContainer() {
  return (
    <Stack spacing={6}>
      <Card>
        <CardHeader
          title={<Typography variant="h2">Create Contact</Typography>}
        />
        <CardContent>
          <ContactCreate />
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          title={<Typography variant="h2">List Contacts</Typography>}
        />
        <CardContent>
          <ContactList />
        </CardContent>
      </Card>
    </Stack>
  );
}

export default ContactContainer;
