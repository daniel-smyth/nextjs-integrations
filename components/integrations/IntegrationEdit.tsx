import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useUser } from '../../context/UserContext';
import {
  useAddUserIntegrationMutation,
  useDeleteUserIntegrationMutation
} from '../../redux/slices/api';
import { Integration } from '../../models/Integration';

interface IntegrationConnectProps {
  defaultValues: Integration;
}

function IntegrationEdit({ defaultValues }: IntegrationConnectProps) {
  const { user } = useUser();
  const initialValue = user?.integrations.find(
    (integration) => integration.name === defaultValues.name
  );
  const [integration, setIntegration] = useState(initialValue || defaultValues);
  const [addNewIntegration, { isLoading: isLoadingNew }] =
    useAddUserIntegrationMutation();
  const [deleteIntegration, { isLoading: isLoadingDelete }] =
    useDeleteUserIntegrationMutation();

  const integrationForm = useForm({
    defaultValues: { ...integration }
  });

  const submitIntegration = async (newIntegration: Integration) => {
    try {
      if (integration.connected) {
        await deleteIntegration(defaultValues.name).unwrap();
        integrationForm.reset();
        setIntegration(defaultValues);
      } else {
        const response = await addNewIntegration(newIntegration).unwrap();
        setIntegration(response);
      }
    } catch (err: any) {
      console.log(err.message); // eslint-disable-line no-console
    }
  };

  return (
    <form onSubmit={integrationForm.handleSubmit(submitIntegration)}>
      <Typography variant="h3" gutterBottom sx={{ pb: 2 }}>
        {integration.name}
      </Typography>

      <Stack spacing={4}>
        {Object.keys(integration.options).map((option) => (
          <React.Fragment key={option}>
            <TextField
              {...integrationForm.register(`options.${option}`, {
                required: true,
                minLength: 1
              })}
              label={option}
              id={`${integration.name}-${option}`}
              disabled={integration.connected === true}
              fullWidth
            />
          </React.Fragment>
        ))}

        {integration.field_mappings && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ pb: 2 }}>
              Field Mappings
            </Typography>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {Object.keys(user?.contacts[0] || {}).map((field) => (
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
        {Object.keys(integrationForm.formState.errors).length !== 0 && (
          <Alert severity="warning">Field&apos;s cannot be empty</Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color={integration.connected ? 'error' : 'primary'}
          disabled={isLoadingNew || isLoadingDelete}
        >
          {isLoadingNew || isLoadingDelete
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
