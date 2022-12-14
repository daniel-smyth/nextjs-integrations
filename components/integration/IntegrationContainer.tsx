import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IntegrationConnect from './IntegrationConnect';
import IntegrationCreate from './IntegrationCreate';
import { Integration } from '../../models/Integration';

function IntegrationContainer() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        let res: any = await fetch(`/api/integrations/`);

        if (res.status === 200) {
          const allIntegrations = await res.json();
          setIntegrations(allIntegrations);
        } else {
          res = await res.json();
          throw new Error(res.error);
        }
      } catch (err: any) {
        console.log(err.message); // eslint-disable-line no-console
      }
    };

    fetchIntegrations();

    return () => {
      setIntegrations([]);
    };
  }, []);

  return (
    <Stack spacing={6}>
      <Card>
        <CardHeader
          title={<Typography variant="h2">Manage Integrations</Typography>}
        />
        <CardContent>
          <Stack spacing={12}>
            {integrations.map((integration) => (
              <IntegrationConnect
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
          <Stack spacing={5}>
            <IntegrationCreate />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default IntegrationContainer;
