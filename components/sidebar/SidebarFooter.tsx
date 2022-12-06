import React from 'react';
import styled from '@emotion/styled';

import Grid from '@mui/material/Grid';

const Footer = styled.div`
  background-color: ${(props) =>
    props.theme.sidebar.footer.background} !important;
  padding: ${(props) => props.theme.spacing(2.75)}
    ${(props) => props.theme.spacing(4)};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

function SidebarFooter({ ...rest }) {
  return (
    <Footer {...rest}>
      <Grid container spacing={2}>
        <Grid item />
      </Grid>
    </Footer>
  );
}

export default SidebarFooter;
