import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface MapProps {
  options: string[];
  onChange: ({ option, value }: { option: string; value: string }) => void;
}

function Map({ options, onChange }: MapProps) {
  const [data, setData] = useState({ option: options[0], value: options[0] });

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const saveMap = () => {
    onChange(data);
    setData({ ...data, value: options[0] });
  };

  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <Select
            name="option"
            value={data.option}
            onChange={handleChange}
            fullWidth
          >
            {options.map((o) => (
              <MenuItem value={o}>{o}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="text"
            name="value"
            value={data.value}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>
      <Button variant="contained" onClick={saveMap}>
        Save Mapping
      </Button>
    </>
  );
}

export default Map;
