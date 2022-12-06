import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Map from './Map';
import useUser from '../hooks/useUser';
import { Integration } from '../models/Integration';

const userContactFields = [
  'given_name',
  'family_name',
  'email',
  'met_at_location',
  'notes'
];

interface IntegrationInputProps {
  integration: Integration;
}

function IntegrationInput({ integration }: IntegrationInputProps) {
  const { saveIntegration } = useUser();
  const [data, setData] = useState<any>(integration);
  const [uploading, setUploading] = useState(false);

  const onOptionBeingChanged = (e: any) => {
    const newIntegration = { ...data };
    data.options[e.target.name] = e.target.value;
    setData(newIntegration);
  };

  const onMappingBeingChanged = ({
    option,
    value
  }: {
    option: string;
    value: string;
  }) => {
    const newIntegration = { ...data };
    data.field_mappings![option] = value;
    setData(newIntegration);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setUploading(true);
      const response = await saveIntegration(data);
      setData({ ...response });
    } catch (err: any) {
      console.log(err.message); // eslint-disable-line no-console
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        {integration.name}
      </Typography>
      <form onSubmit={onSubmit} data-testid="form">
        <Stack spacing={4}>
          {Object.keys(data.options).map((key) => (
            <TextField
              id={integration.name + key}
              name={key}
              value={data.options[key]}
              label={key}
              key={key}
              onChange={onOptionBeingChanged}
              disabled={data.connected === true}
              fullWidth
            />
          ))}
          {data.field_mappings && (
            <>
              <Typography variant="h5">Mappings</Typography>
              {Object.keys(data.field_mappings!).map((field_mapping) => (
                <Grid container>
                  <Grid item xs={6}>
                    <TextField value={field_mapping} fullWidth disabled />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      value={data.field_mappings![field_mapping]}
                      fullWidth
                      disabled
                    />
                  </Grid>
                </Grid>
              ))}
              <Map
                options={userContactFields.filter(
                  (field) => !Object.keys(data.field_mappings!).includes(field)
                )}
                onChange={onMappingBeingChanged}
              />
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            color={data.connected ? 'error' : 'primary'}
            disabled={uploading}
          >
            {uploading
              ? 'Changing Integration...'
              : !data.connected
              ? 'Connect Integration'
              : 'Disconnect Intergration'}
          </Button>
        </Stack>
      </form>
    </>
  );
}

export default IntegrationInput;
