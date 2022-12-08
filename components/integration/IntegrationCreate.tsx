import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Integration } from '../../models/Integration';

type IntegrationCreateForm = {
  name: string;
  options: { name: string }[];
  field_mappings: boolean;
};

function IntegrationCreate() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ type: string; message: string }>();

  const schema = z
    .object({
      name: z
        .string()
        .min(1)
        .regex(/^(\d|\w)+$/u)
    })
    .passthrough();

  const integrationForm = useForm<IntegrationCreateForm>({
    defaultValues: {
      name: '',
      options: [],
      field_mappings: false
    },
    resolver: zodResolver(schema)
  });

  const optionsArray = useFieldArray({
    control: integrationForm.control,
    name: 'options'
  });

  const addIntegration = async (form: IntegrationCreateForm) => {
    try {
      const body: Integration = {
        name: form.name,
        options: {},
        connected: false
      };

      // Form integration options are stored as array, convert to object
      const options: any = {};
      form.options.forEach((o) => {
        options[o.name] = '';
      });
      body.options = options;

      // Add empty field mappings if integrations should have field mappings
      if (form.field_mappings) {
        body.field_mappings = {};
      }

      let res: any = await fetch(`/api/integrations/`, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (res.status === 201) {
        integrationForm.reset();
        setResult({ type: 'success', message: 'New integration created' });
      } else {
        res = await res.json();
        throw new Error(res.error);
      }
    } catch (err: any) {
      console.log(err.message); // eslint-disable-line no-console
      setResult({ type: 'error', message: err.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={integrationForm.handleSubmit(addIntegration)}>
      <Stack spacing={4}>
        <TextField
          {...integrationForm.register('name', {
            required: true
          })}
          label="Name"
          id="new-integration-name"
          fullWidth
        />
        {integrationForm.formState.errors.name && (
          <Alert severity="warning">
            Name can only be characters and numbers
          </Alert>
        )}
        {optionsArray.fields.map((f, i) => (
          <React.Fragment key={JSON.stringify(f)}>
            <TextField
              {...integrationForm.register(`options.${i}.name`)}
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
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                fullWidth
                disabled={uploading}
                onClick={() => optionsArray.append({ name: '' })}
              >
                Add Field
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                disabled={uploading}
                onClick={() => optionsArray.remove(-1)}
              >
                Remove Field
              </Button>
            </Grid>
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
            <strong>{result?.message}</strong>
          </Alert>
        </Collapse>
        <Button type="submit" variant="contained" disabled={uploading}>
          {uploading ? 'Adding Integration...' : 'Create Integration'}
        </Button>
      </Stack>
    </form>
  );
}

export default IntegrationCreate;
