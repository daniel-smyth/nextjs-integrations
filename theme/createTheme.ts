import '@mui/lab/themeAugmentation';

import { createTheme as createMuiTheme } from '@mui/material/styles';
import variants from './variants';
import typography from './typography';
import breakpoints from './breakpoints';
import components from './components';
import shadows from './shadows';

export const THEME = 'BLUE';

const createTheme = (name: string) => {
  let themeConfig = variants.find((variant) => variant.name === name);

  if (!themeConfig) {
    // eslint-disable-next-line prefer-destructuring
    themeConfig = variants.at(-1)!;
  }

  return createMuiTheme(
    {
      spacing: 4,
      breakpoints,
      // @ts-ignore
      components,
      typography,
      shadows,
      palette: themeConfig.palette
    },
    {
      name: themeConfig.name,
      header: themeConfig.header,
      footer: themeConfig.footer,
      sidebar: themeConfig.sidebar
    }
  );
};

export default createTheme;
