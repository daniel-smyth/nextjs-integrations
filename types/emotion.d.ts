import '@emotion/react';

// Allows us to add properties to the default emotion theme
declare module '@emotion/react' {
  export interface Theme extends Record<string, any> {}
}
