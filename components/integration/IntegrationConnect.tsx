import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useUser } from '../../context/UserContext';
import { Integration } from '../../models/Integration';

type IntegrationConnectForm = {
  [key: string]: string;
};

interface IntegrationConnectProps {
  defaultValues: Integration;
}

function IntegrationConnect({ defaultValues }: IntegrationConnectProps) {
  const { user } = useUser();
  const initialValue = user?.integrations.find(
    (i) => i.name === defaultValues.name
  );
  const [integration, setIntegration] = useState(initialValue || defaultValues);
  const [uploading, setUploading] = useState(false);

  const getSchema = () => {
    const schema: {
      [key: string]: z.ZodString;
    } = {};

    // Add integration's options to schema
    Object.keys(integration.options).forEach((options) => {
      schema[options] = z.string().min(1);
    });

    if (integration.field_mappings) {
      // Add integration's mappings (if has mappings) to schema
      Object.keys(integration.field_mappings).forEach((field_mapping) => {
        schema[field_mapping] = z.string().min(1);
      });
    }

    return z.object(schema).passthrough();
  };

  const integrationForm = useForm<IntegrationConnectForm>({
    defaultValues: { ...integration.options, ...integration.field_mappings },
    resolver: zodResolver(getSchema())
  });

  const integrationFormSubmit = async (form: IntegrationConnectForm) => {
    if (integration.connected) {
      // Disconnect - If connected disconnect and delete on submit
      let res: any = await fetch(`/api/integrations/${integration.name}`, {
        method: 'DELETE'
      });

      if (res.status === 200) {
        const newFormValues = {
          ...defaultValues.options // Reset values to ''
        };
        if (integration.field_mappings) {
          Object.keys(user?.contacts[0]!).forEach((field_mapping) => {
            newFormValues[field_mapping] = ''; // Reset values to ''
          });
        }
        integrationForm.reset(newFormValues);
        setIntegration(defaultValues);
      } else {
        res = await res.json();
        throw new Error(res.error);
      }
    } else {
      // No duplicate integration values allowed
      const duplicateEntries =
        new Set(Object.values(form)).size !== Object.values(form).length;

      if (duplicateEntries) {
        integrationForm.setError('duplicates', {
          type: 'custom',
          message: 'Integration values cannot be the same'
        });
      }
      // Connect - Not connected and no duplicates, add new integration
      else {
        const body: Integration = {
          name: integration.name,
          options: {},
          connected: false
        };

        // Populate new integration with values from form
        Object.keys(integration.options).forEach((option) => {
          body.options[option] = form[option];
          // Delete option from form, leaving only field_mappings (if present)
          delete form[option]; // eslint-disable-line no-param-reassign
        });

        if (integration.field_mappings) {
          body.field_mappings = {};
          // By here, only remaining form values are integration's field_mappings
          Object.keys(form).forEach((field_mapping) => {
            body.field_mappings![field_mapping] = form[field_mapping];
          });
        }

        try {
          setUploading(true);

          let res: any = await fetch(`/api/integrations/${integration.name}`, {
            method: 'POST',
            body: JSON.stringify(body)
          });

          if (res.status === 200) {
            const connectedIntegration = await res.json();
            setIntegration(connectedIntegration);
          } else {
            res = await res.json();
            throw new Error(res.error);
          }
        } catch (err: any) {
          console.log(err.message); // eslint-disable-line no-console
        } finally {
          setUploading(false);
        }
      }
    }
  };

  return (
    <form onSubmit={integrationForm.handleSubmit(integrationFormSubmit)}>
      <Typography variant="h3" gutterBottom sx={{ pb: 4 }}>
        {integration.name}
      </Typography>

      <Stack spacing={4}>
        {Object.keys(integration.options).map((option) => (
          <React.Fragment key={option}>
            <TextField
              {...integrationForm.register(option, {
                required: true
              })}
              label={option}
              id={`${integration.name}-${option}`}
              disabled={integration.connected === true}
              fullWidth
            />
            {integrationForm.formState.errors[option] && (
              <Alert severity="warning">Invalid {option}</Alert>
            )}
          </React.Fragment>
        ))}

        {integration.field_mappings && (
          <>
            <Typography variant="h5">Mappings</Typography>
            <Box>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                {Object.keys(user?.contacts[0]!).map((contactField) => (
                  <React.Fragment key={contactField}>
                    <Grid item xs={6}>
                      <TextField value={contactField} fullWidth disabled />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        {...integrationForm.register(contactField, {
                          required: true
                        })}
                        id={`${integration.name}-${contactField}`}
                        fullWidth
                        disabled={integration.connected === true}
                      />
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          </>
        )}
        {integrationForm.formState.errors.duplicates && (
          <Alert severity="warning">
            {integrationForm.formState.errors.duplicates.message}
          </Alert>
        )}
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

export default IntegrationConnect;