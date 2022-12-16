import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useGetContactsQuery } from '../../redux/slices/api';
import ErrorMessage from '../ErrorMessage';
import LoadingProgress from '../LoadingProgress';

function ContactList() {
  const {
    data: contacts,
    isLoading,
    isUninitialized,
    isError
  } = useGetContactsQuery();

  if (isLoading || isUninitialized) {
    return <LoadingProgress />;
  }

  if (isError) {
    return <ErrorMessage message="Error loading contacts" />;
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
            <TableRow key={row.email}>
              <TableCell component="th" scope="row">
                {row.email}
              </TableCell>
              <TableCell align="right">{row.given_name}</TableCell>
              <TableCell align="right">{row.family_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ContactList;
