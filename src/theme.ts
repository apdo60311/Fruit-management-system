import { createTheme } from '@mui/material/styles';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

// Color palette
const primary = {
  main: '#3B82F6',
  light: '#60A5FA',
  dark: '#2563EB',
  contrastText: '#FFFFFF',
};

const secondary = {
  main: '#10B981', // Green
  light: '#34D399',
  dark: '#059669',
  contrastText: '#FFFFFF',
};

const error = {
  main: '#EF4444', // Red
  light: '#F87171',
  dark: '#DC2626',
  contrastText: '#FFFFFF',
};

const warning = {
  main: '#F59E0B', // Amber
  light: '#FBBF24',
  dark: '#D97706',
  contrastText: '#FFFFFF',
};

const info = {
  main: '#3B82F6', // Blue
  light: '#60A5FA',
  dark: '#2563EB',
  contrastText: '#FFFFFF',
};

const success = {
  main: '#10B981', // Green
  light: '#34D399',
  dark: '#059669',
  contrastText: '#FFFFFF',
};

// Create rtl cache
export function createRtlCache() {
  return createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });
}

// Create theme factory
export function createAppTheme(direction: 'ltr' | 'rtl') {
  return createTheme({
    direction,
    palette: {
      primary,
      secondary,
      error,
      warning,
      info,
      success,
      background: {
        default: '#F3F4F6',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#1F2937',
        secondary: '#4B5563',
        disabled: '#9CA3AF',
      },
    },
    typography: {
      fontFamily: direction === 'rtl' 
        ? ['Noto Sans Arabic', 'sans-serif'].join(',')
        : [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            },
          },
          containedPrimary: {
            backgroundColor: primary.main,
            '&:hover': {
              backgroundColor: primary.dark,
            },
          },
          containedSecondary: {
            backgroundColor: secondary.main,
            '&:hover': {
              backgroundColor: secondary.dark,
            },
          },
          outlinedPrimary: {
            borderColor: primary.main,
            color: primary.main,
            '&:hover': {
              backgroundColor: `${primary.main}10`,
            },
          },
          outlinedSecondary: {
            borderColor: secondary.main,
            color: secondary.main,
            '&:hover': {
              backgroundColor: `${secondary.main}10`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            padding: '16px 24px',
          },
          title: {
            fontSize: '1.25rem',
            fontWeight: 600,
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: '24px',
            '&:last-child': {
              paddingBottom: '24px',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            boxShadow: '2px 0px 8px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
  });
}

// Default theme
export default createAppTheme('ltr');