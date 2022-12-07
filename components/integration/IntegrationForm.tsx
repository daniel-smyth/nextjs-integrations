import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useUser } from '../../context/UserContext';
import { Integration } from '../../models/Integration';

interface IntegrationFormProps {
  defaultValue: Integration;
}

function IntegrationForm({ defaultValue }: IntegrationFormProps) {
  const { user } = useUser();
  const initialValue = user?.integrations.find(
    (i) => i.name === defaultValue.name
  );
  const [integration, setIntegration] = useState(initialValue || defaultValue);
  const [uploading, setUploading] = useState(false);

  const getSchema = () => {
    const schemaOptions: { [key: string]: z.ZodString } = {};

    Object.keys(integration.options).forEach((option) => {
      schemaOptions[option] = z.string().min(1);
    });

    if (integration.field_mappings) {
      Object.keys(integration.field_mappings).forEach((field_mapping) => {
        schemaOptions[field_mapping] = z.string().min(1);
      });
    }

    return z.object(schemaOptions).passthrough();
  };

  const integrationForm = useForm({
    defaultValues: {
      ...integration.options,
      ...integration.field_mappings
    },
    resolver: zodResolver(getSchema())
  });

  const integrationSubmit = async (form: { [key: string]: string }) => {
    if (integration.connected) {
      // Disconnect if connected
      let res: any = await fetch(`/api/integrations/${defaultValue.name}`, {
        method: 'DELETE'
      });

      if (res.status === 200) {
        setIntegration(defaultValue);
        integrationForm.reset();
      } else {
        res = await res.json();
        throw new Error(res.error);
      }
      return;
    }

    const hasDuplicates =
      new Set(Object.values(form)).size !== Object.values(form).length;

    if (hasDuplicates) {
      integrationForm.setError('test', {
        type: 'custom',
        message: 'Integration values cannot be the same'
      });
      return;
    }

    const body: { [key: string]: any } = {
      name: defaultValue.name,
      options: {}
    };

    // Populate integration with form values
    Object.keys(integration.options).forEach((option) => {
      body.options[option] = form[option];
      delete form[option]; // eslint-disable-line no-param-reassign
    });

    if (integration.field_mappings) {
      body.field_mappings = {};

      // By this point, the only remaining fields are field_mappings
      Object.keys(form).forEach((field_mapping) => {
        body.field_mappings[field_mapping] = form[field_mapping];
      });
    }

    try {
      setUploading(true);

      let res: any = await fetch(`/api/integrations/${defaultValue.name}`, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (res.status === 200) {
        const reponse = await res.json();
        setIntegration(reponse);
      } else {
        res = await res.json();
        throw new Error(res.error);
      }
    } catch (err: any) {
      console.log(err.message); // eslint-disable-line no-console
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={integrationForm.handleSubmit(integrationSubmit)}>
      <Typography variant="h3" gutterBottom sx={{ pb: 4 }}>
        {defaultValue.name}
      </Typography>
      <Stack spacing={4}>
        {Object.keys(integration.options).map((option, i) => (
          <div key={option}>
            <TextField
              {...integrationForm.register(option, {
                required: true
              })}
              label={option}
              id={`${defaultValue.name}-${option}`}
              disabled={integration.connected === true}
              fullWidth
            />
            {integrationForm.formState.errors[option] && (
              <Alert severity="warning">{option} cannot be empty</Alert>
            )}
          </div>
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
                {Object.keys(user?.contacts[0]!).map((field) => (
                  <React.Fragment key={field}>
                    <Grid item xs={6}>
                      <TextField value={field} fullWidth disabled />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        {...integrationForm.register(field, {
                          required: true
                        })}
                        id={`${defaultValue.name}-${field}`}
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
        {integrationForm.formState.errors.test && (
          <Alert severity="warning">
            {integrationForm.formState.errors.test.message}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color={integration.connected ? 'error' : 'primary'}
          disabled={uploading}
        >
          {uploading
            ? 'Changing Integration...'
            : !integration.connected
            ? `Connect ${defaultValue.name}`
            : `Disconnect ${defaultValue.name}`}
        </Button>
      </Stack>
    </form>
  );
}

export default IntegrationForm;
