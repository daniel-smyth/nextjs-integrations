import React from 'react';
import Alert from '@mui/material/Alert';

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return <Alert severity="error">{message}</Alert>;
}

export default ErrorMessage;
