import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useGetContactsQuery } from '../../redux/slices/api';
import { Contact } from '../../models/Contact';

interface ContactListItemProps {
  contact: Contact;
}

function ContactListItem({ contact }: ContactListItemProps) {
  const { email, given_name, family_name } = contact;

  return (
    <TableRow key={email}>
      <TableCell component="th" scope="row">
        {email}
      </TableCell>
      <TableCell align="right">{given_name}</TableCell>
      <TableCell align="right">{family_name}</TableCell>
    </TableRow>
  );
}

function ContactList() {
  const { data: contacts } = useGetContactsQuery();

  if (!contacts) {
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell align="right">Given Name</TableCell>
            <TableCell align="right">Family Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.map((row) => (
            <ContactListItem contact={row} key={row.id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ContactList;
