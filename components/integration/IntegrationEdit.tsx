import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Alert, { AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { useUser } from '../../context/UserContext';
import { Integration } from '../../models/Integration';

interface IntegrationEditProps {
  defaultValues: Integration;
}

function IntegrationEdit({ defaultValues }: IntegrationEditProps) {
  const { user } = useUser();
  const initialValue = user?.integrations.find(
    (integration) => integration.name === defaultValues.name
  );
  const [integration, setIntegration] = useState(initialValue || defaultValues);
  const [result, setResult] = useState<{ type: string; message: string }>();
  const [uploading, setUploading] = useState(false);

  const integrationForm = useForm({
    defaultValues: { ...integration }
  });

  const connectIntegration = async (newIntegration: Integration) => {
    let res: any = await fetch(`/api/integrations/${integration.name}`, {
      method: 'POST',
      body: JSON.stringify(newIntegration)
    });

    if (res.status === 200) {
      const connectedIntegration = await res.json();
      setIntegration(connectedIntegration);
    } else {
      res = await res.json();
      throw new Error(res.error);
    }
  };

  const disconnectIntegration = async () => {
    let res: any = await fetch(`/api/integrations/${integration.name}`, {
      method: 'DELETE'
    });

    if (res.status === 200) {
      integrationForm.reset();
      setIntegration(defaultValues);
    } else {
      res = await res.json();
      throw new Error(res.error);
    }
  };

  const submitIntegration = async (newIntegration: Integration) => {
    try {
      setUploading(true);

      if (integration.connected) {
        await disconnectIntegration();
      } else {
        await connectIntegration(newIntegration);
      }
    } catch (err: any) {
      console.log(err.message); // eslint-disable-line no-console
      setResult({ type: 'error', message: err.message });
    } finally {
      setUploading(false);
      setResult({ type: 'success', message: 'Integration connected' });
    }
  };

  return (
    <form onSubmit={integrationForm.handleSubmit(submitIntegration)}>
      <Typography variant="h3" gutterBottom sx={{ pb: 4 }}>
        {integration.name}
      </Typography>

      <Stack spacing={4}>
        {Object.keys(integration.options).map((option) => (
          <React.Fragment key={option}>
            <TextField
              {...integrationForm.register(`options.${option}.value`, {
                required: true,
                minLength: 1,
                validate: (value) => {
                  // eslint-disable-next-line no-restricted-syntax
                  for (const validator of integration.options[option]
                    .validators) {
                    if (new RegExp(validator).test(value) === false) {
                      return 'You failed';
                    }
                  }
                  return true;
                }
              })}
              label={option}
              id={`${integration.name}-${option}`}
              disabled={integration.connected === true}
              fullWidth
            />
            {integrationForm.formState.errors.options?.[option] && (
              <Alert severity="warning">
                {
                  integrationForm.formState.errors.options?.[option]?.value
                    .message
                }
              </Alert>
            )}
          </React.Fragment>
        ))}

        <Typography variant="h5">Field Mappings</Typography>
        {integration.field_mappings && (
          <Box>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {Object.keys(user?.contacts[0]!).map((field) => (
                <React.Fragment key={field}>
                  <Grid item xs={6}>
                    <TextField value={field} fullWidth disabled />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      {...integrationForm.register(`field_mappings.${field}`, {
                        required: true,
                        minLength: 1
                      })}
                      id={`${integration.name}-${field}`}
                      fullWidth
                      disabled={integration.connected === true}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Box>
        )}
        <Collapse in={!!result}>
          <Alert
            severity={result?.type as AlertColor}
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={() => setResult(undefined)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <strong>{result?.message}</strong>
          </Alert>
        </Collapse>
        <Button
          type="submit"
          variant="contained"
          color={integration.connected ? 'error' : 'primary'}
          disabled={uploading}
        >
          {uploading
            ? 'Connecting Integration...'
            : !integration.connected
            ? `Connect ${integration.name}`
            : `Disconnect ${integration.name}`}
        </Button>
      </Stack>
    </form>
  );
}

export default IntegrationEdit;
