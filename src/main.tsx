import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
import './styles.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5',
      dark: '#3730a3',
    },
    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily:
      'Pretendard, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.04em',
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
