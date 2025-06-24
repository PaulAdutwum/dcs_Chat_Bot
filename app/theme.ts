import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: 'hsl(350, 78%, 30%)', // --colorGarnet
      light: 'hsl(351, 80%, 34%)', // --colorGarnet_bright
      dark: 'hsl(349, 98%, 18%)', // --colorGarnet_dark
    },
    secondary: {
      main: 'hsl(198, 86%, 27%)', // --colorBlue
      light: 'hsl(195, 61%, 46%)', // --colorBlue_bright
      dark: 'hsl(198, 94%, 14%)', // --colorBlue_dark
    },
  },
  typography: {
    fontFamily: [
      '"Neue Frutiger W01"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: '"Sabon Next W01", Georgia, serif',
    },
    h2: {
      fontFamily: '"Sabon Next W01", Georgia, serif',
    },
    h3: {
      fontFamily: '"Sabon Next W01", Georgia, serif',
    },
    h4: {
      fontFamily: '"Sabon Next W01", Georgia, serif',
    },
    h5: {
      fontFamily: '"Sabon Next W01", Georgia, serif',
    },
    h6: {
      fontFamily: '"Sabon Next W01", Georgia, serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme; 