import React from 'react';
import styled from '@emotion/styled';
import { spacing } from '@mui/system';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiCard from '@mui/material/Card';
import MuiDivider from '@mui/material/Divider';
import MuiGrid from '@mui/material/Grid';
import MuiTypography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import DashboardLayout from '../layouts/Dashboard';
import useUser from '../hooks/useUser';
import IntegrationInput from '../components/IntegrationInput';

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Grid = styled(MuiGrid)(spacing);
const Typography = styled(MuiTypography)(spacing);

function Profile() {
  const { user } = useUser();

  return (
    <DashboardLayout>
      <Typography variant="h3" gutterBottom display="inline">
        Profile
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link href="/">Blinq</Link>
        <Typography>Profile</Typography>
      </Breadcrumbs>
      <Divider my={6} />
      <Grid container spacing={6}>
        <Grid item xs={12} lg={12} xl={12}>
          <Card>
            <CardContent>
              <Typography variant="h2" pb={6}>
                Integrations
              </Typography>

              <Stack spacing={5}>
                {user?.integrations.map((integration) => (
                  <IntegrationInput
                    integration={integration}
                    key={integration.name}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default Profile;
