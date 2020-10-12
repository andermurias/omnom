import red from '@material-ui/core/colors/red';
import amber from '@material-ui/core/colors/amber';

export const isDarkTheme = (theme) => theme.palette.type === 'dark';

export const theme = (prefersDarkMode) => ({
  props: {
    MuiButton: {
      disableElevation: true,
    },
  },
  palette: {
    type: prefersDarkMode ? 'dark' : 'light',
    primary: {
      main: prefersDarkMode ? red[300] : red[500],
    },
    secondary: {
      main: prefersDarkMode ? amber[300] : amber[500],
    },
  },
});
