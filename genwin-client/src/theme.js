const theme = {
  colors: {
    primary: {
      main: '#FF3CAC',
      light: '#FF9A5F',
      dark: '#E31B8D',
      gradient: 'linear-gradient(45deg, #FF3CAC 0%, #FF9A5F 50%, #FFC83D 100%)',
    },
    secondary: {
      main: '#6C63FF',
      light: '#8F88FF',
      dark: '#4A42FF',
    },
    background: {
      main: '#F9F8FD',
      card: '#FFFFFF',
      gradient: 'radial-gradient(#ff9a8b 2px, transparent 2px), radial-gradient(#fad0c4 2px, transparent 2px)',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      light: '#FFFFFF',
    },
    status: {
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FFC107',
      info: '#2196F3',
    },
  },
  shadows: {
    card: '0 4px 6px rgba(0, 0, 0, 0.1)',
    hover: '0 10px 15px rgba(0, 0, 0, 0.2)',
    button: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '24px',
    circle: '50%',
  },
  typography: {
    fontFamily: {
      main: '"Fredoka", sans-serif',
      display: '"Pacifico", cursive',
    },
  },
  animation: {
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
  },
};

export default theme;