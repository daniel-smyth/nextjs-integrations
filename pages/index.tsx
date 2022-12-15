import React from 'react';
import { Tag, User, Users } from 'react-feather';
import styled from '@emotion/styled';
import { spacing } from '@mui/system';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useUser } from '../context/UserContext';
import DashboardLayout from '../layouts/Dashboard';
import IntegrationContainer from '../components/integration/IntegrationContainer';

const Spacer = styled.div(spacing);

const AboutIcon = styled.span`
  display: flex;
  padding-right: ${(props) => props.theme.spacing(2)};

  svg {
    width: 14px;
    height: 14px;
  }
`;

function About() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          About
        </Typography>
        <Spacer mb={4} />
        <Grid container direction="row" alignItems="center" mb={2}>
          <Grid item>
            <AboutIcon>
              <User />
            </AboutIcon>
          </Grid>
          <Grid item>
            {user.given_name} {user.family_name}
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" mb={2}>
          <Grid item>
            <AboutIcon>
              <Tag />
            </AboutIcon>
          </Grid>
          <Grid item>{user.email}</Grid>
        </Grid>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <AboutIcon>
              <Users />
            </AboutIcon>
          </Grid>
          <Grid item>{user.contacts.length} Contacts</Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function Profile() {
  return (
    <DashboardLayout>
      <Typography variant="h3" gutterBottom>
        Profile
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" sx={{ mt: 2 }}>
        <Link href="/">Blinq</Link>
        <Typography>Profile</Typography>
      </Breadcrumbs>
      <Divider sx={{ my: 6 }} />
      <Grid container spacing={6}>
        <Grid item xs={12} lg={4} xl={3}>
          <About />
        </Grid>
        <Grid item xs={12} lg={8} xl={9}>
          <IntegrationContainer />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default Profile;
