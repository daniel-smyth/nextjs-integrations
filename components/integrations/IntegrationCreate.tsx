import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import Alert, { AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useAddIntegrationMutation } from '../../redux/slices/api';
import { Integration } from '../../models/Integration';

type IntegrationCreateForm = {
  name: string;
  options: { field: string }[];
  field_mappings: boolean;
};

function IntegrationCreate() {
  const [addNewIntegration, { isLoading }] = useAddIntegrationMutation();
  const [result, setResult] = useState<{ type: string; message: string }>();

  const integrationForm = useForm<IntegrationCreateForm>({
    defaultValues: {
      name: '',
      options: [{ field: '' }],
      field_mappings: false
    }
  });

  const integrationFormOptionsArray = useFieldArray({
    name: 'options',
    control: integrationForm.control
  });

  const addIntegration = async (form: IntegrationCreateForm) => {
    try {
      const body: Integration = {
        name: form.name,
        options: form.options.reduce((a, v) => ({ ...a, [v.field]: '' }), {}),
        connected: false
      };

      if (form.field_mappings) {
        body.field_mappings = {};
      }

      await addNewIntegration(body).unwrap();
      setResult({ type: 'success', message: 'New integration created' });
    } catch (err: any) {
      console.log(err.message); // eslint-disable-line no-console
      setResult({ type: 'error', message: err.message });
    }
  };

  return (
    <form onSubmit={integrationForm.handleSubmit(addIntegration)}>
      <Stack spacing={4}>
        <TextField
          {...integrationForm.register('name', {
            required: true,
            minLength: 1
          })}
          label="Name"
          id="new-integration-name"
          fullWidth
        />
        {integrationFormOptionsArray.fields.map((f, i) => (
          <React.Fragment key={JSON.stringify(f)}>
            <TextField
              {...integrationForm.register(`options.${i}.field`, {
                required: true,
                minLength: 1
              })}
              label="Option"
              id={`integration-options-${i}`}
              fullWidth
            />
          </React.Fragment>
        ))}
        <Box>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid
              item
              xs={12}
              md={integrationFormOptionsArray.fields.length === 1 ? 8 : 4}
            >
              <Button
                variant="outlined"
                fullWidth
                disabled={isLoading}
                onClick={() =>
                  integrationFormOptionsArray.append({ field: '' })
                }
              >
                Add Field
              </Button>
            </Grid>
            {integrationFormOptionsArray.fields.length > 1 && (
              <Grid item xs={12} md={4}>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  disabled={isLoading}
                  onClick={() => integrationFormOptionsArray.remove(-1)}
                >
                  Remove Field
                </Button>
              </Grid>
            )}
            <Grid item textAlign="center" xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox {...integrationForm.register('field_mappings')} />
                }
                label="Mappings"
                id="new-integration-mappings"
              />
            </Grid>
          </Grid>
        </Box>
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
            <strong id="integration-create-result">{result?.message}</strong>
          </Alert>
        </Collapse>
        {Object.keys(integrationForm.formState.errors).length !== 0 && (
          <Alert severity="warning">Fields cannot be empty</Alert>
        )}
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? 'Adding Integration...' : 'Create Integration'}
        </Button>
      </Stack>
    </form>
  );
}

export default IntegrationCreate;
