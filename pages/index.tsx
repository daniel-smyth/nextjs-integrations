import React from 'react';
import styled from '@emotion/styled';
import { spacing } from '@mui/system';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Tag, User, Users } from 'react-feather';
import { useUser } from '../context/UserContext';
import DashboardLayout from '../layouts/Dashboard';
import ContactCreate from '../components/contacts/ContactCreate';
import ContactList from '../components/contacts/ContactList';
import IntegrationCreate from '../components/integrations/IntegrationCreate';
import IntegrationsManage from '../components/integrations/IntegrationManage';
import LoadingProgress from '../components/LoadingProgress';

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
    return <LoadingProgress />;
  }

  return (
    <>
      <Grid container direction="row" alignItems="center" mb={2}>
        <Grid item>
          <AboutIcon>
            <User />
          </AboutIcon>
        </Grid>
        <Grid item>
          {user?.given_name} {user?.family_name}
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center" mb={2}>
        <Grid item>
          <AboutIcon>
            <Tag />
          </AboutIcon>
        </Grid>
        <Grid item>{user?.email}</Grid>
      </Grid>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <AboutIcon>
            <Users />
          </AboutIcon>
        </Grid>
        <Grid item>{user?.contacts.length} Contacts</Grid>
      </Grid>
    </>
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
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              <Spacer mb={4} />
              <About />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={8} xl={9}>
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
        </Grid>
        <Grid item xs={12} lg={4} xl={3} />
        <Grid item xs={12} lg={8} xl={9}>
          <Stack spacing={6}>
            <Card>
              <CardHeader
                title={
                  <Typography variant="h2">Manage Integrations</Typography>
                }
              />
              <CardContent>
                <IntegrationsManage />
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                title={<Typography variant="h2">Add integration</Typography>}
              />
              <CardContent>
                <IntegrationCreate />
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default Profile;
