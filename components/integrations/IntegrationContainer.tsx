import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IntegrationEdit from './IntegrationEdit';
import IntegrationCreate from './IntegrationCreate';
import { useGetIntegrationsQuery } from '../../redux/slices/api';

function IntegrationContainer() {
  const { data: integrations } = useGetIntegrationsQuery();

  if (!integrations) {
    return null;
  }

  return (
    <Stack spacing={6}>
      <Card>
        <CardHeader
          title={<Typography variant="h2">Manage Integrations</Typography>}
        />
        <CardContent>
          <Stack spacing={12}>
            {integrations.map((integration) => (
              <IntegrationEdit
                defaultValues={integration}
                key={integration.name}
              />
            ))}
          </Stack>
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
  );
}

export default IntegrationContainer;
