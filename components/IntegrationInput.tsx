import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Integration } from '../models/Integration';

interface IntegrationInputProps {
  integration: Integration;
}

function IntegrationInput({ integration }: IntegrationInputProps) {
  const initialData = {
    integration,
    uploading: false
  };
  const [data, setData] = useState(initialData);
  const [uploading, setUploading] = useState(false);

  const onDataBeingChanged = (e: any) => {
    const newData = { ...data };
    newData.integration.options[e.target.name] = e.target.value;
    setData(newData);
  };

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await uploadToServer();
  };

  const uploadToServer = async () => {
    const body = JSON.stringify(data.integration);

    setData({ ...data, uploading: true });

    try {
      setUploading(true);

      let res: any = await fetch(`/api/integrations/${integration.name}`, {
        method: 'PUT',
        body
      });

      if (res.status === 200) {
        const response = await res.json();

        console.log(response);
        data.integration = response;
        setData({ ...data });
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
    <Container>
      <Typography variant="h6" pb={4}>
        {integration.name}
      </Typography>
      <form onSubmit={onAdd} encType="multipart/form-data" data-testid="form">
        <Stack spacing={4}>
          {Object.keys(data.integration.options).map((key) => (
            <TextField
              type="text"
              id={integration.name + key}
              name={key}
              label={key}
              key={key}
              value={data.integration.options[key]}
              fullWidth
              onChange={onDataBeingChanged}
              disabled={data.integration.connected === true}
            />
          ))}
          <Button
            type="submit"
            disabled={uploading}
            variant="contained"
            color={data.integration.connected ? 'error' : 'primary'}
          >
            {uploading
              ? 'Changing Integration...'
              : !data.integration.connected
              ? 'Connect Integration'
              : 'Disconnect Intergration'}
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

export default IntegrationInput;
