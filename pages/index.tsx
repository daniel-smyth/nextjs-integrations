import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Integration from '../components/Integration';
import DashboardLayout from '../layouts/Dashboard';
import useUser from '../hooks/useUser';

function Profile() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

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
      <Card>
        <CardHeader
          title={<Typography variant="h2">Integrations</Typography>}
        />
        <CardContent>
          <Stack spacing={5}>
            {user.integrations.map((integration) => (
              <Integration integration={integration} key={integration.name} />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default Profile;
