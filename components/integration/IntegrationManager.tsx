import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

type IntegrationFormType = {
  name: string;
  options: { name: string }[];
  field_mappings: boolean;
};

function IntegrationManager() {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const schema = z
    .object({
      name: z
        .string()
        .min(1)
        .regex(/^'?\p{L}+(?:[' ]\p{L}+)*'?$/u)
    })
    .passthrough();

  const integrationForm = useForm<IntegrationFormType>({
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

  const addIntegration = async (form: IntegrationFormType) => {
    try {
      const integrationOptions: { [key: string]: string } = {};

      form.options.forEach((o) => {
        integrationOptions[o.name] = '';
      });

      const body: { [key: string]: any } = {
        name: form.name,
        options: integrationOptions
      };

      if (form.field_mappings) {
        body.field_mappings = {};
      }

      let res: any = await fetch(`/api/integrations/`, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (res.status === 201) {
        integrationForm.reset(); // If disconnecting, reset form values to ''
        setSuccess(true);
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
          <Alert severity="warning">Name cannot only be characters</Alert>
        )}
        {optionsArray.fields.map((f, i) => (
          <React.Fragment key={JSON.stringify(f)}>
            <TextField
              {...integrationForm.register(`options.${i}.name`)}
              label="Option"
              id={`integration-field-${i}`}
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
                disabled={uploading}
                onClick={() => optionsArray.append({ name: '' })}
                fullWidth
              >
                Add Field
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                color="error"
                disabled={uploading}
                onClick={() => optionsArray.remove(-1)}
                fullWidth
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
        <Collapse in={success}>
          <Alert
            severity="success"
            action={
              <IconButton color="inherit" onClick={() => setSuccess(false)}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <strong>Timeseries created</strong>
          </Alert>
        </Collapse>
        <Button type="submit" variant="contained" disabled={uploading}>
          {uploading ? 'Changing Integration...' : 'Create Integration'}
        </Button>
      </Stack>
    </form>
  );
}

export default IntegrationManager;
