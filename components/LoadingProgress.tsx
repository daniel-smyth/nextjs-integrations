import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box, { BoxProps } from '@mui/material/Box';

function LoadingProgress(props: BoxProps) {
  return (
    <Box display="flex" justifyContent="center" {...props}>
      <CircularProgress />;
    </Box>
  );
}

export default LoadingProgress;
