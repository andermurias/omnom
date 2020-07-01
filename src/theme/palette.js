import {colors} from '@material-ui/core';

const white = '#FFFFFF';
const black = '#000000';

// eslint-disable-next-line object-shorthand
export default {
  black,
  white,
  primary: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[800],
    light: colors.red[100],
  },
  secondary: {
    contrastText: white,
    dark: colors.lime[900],
    main: colors.lime[400],
    light: colors.lime[400],
  },
  success: {
    contrastText: white,
    dark: colors.lightGreen[900],
    main: colors.lightGreen[600],
    light: colors.lightGreen[400],
  },
  info: {
    contrastText: white,
    dark: colors.cyan[900],
    main: colors.cyan[600],
    light: colors.cyan[400],
  },
  warning: {
    contrastText: white,
    dark: colors.amber[900],
    main: colors.amber[600],
    light: colors.amber[400],
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400],
  },
  text: {
    primary: colors.blueGrey[900],
    secondary: colors.blueGrey[600],
    link: colors.blue[600],
  },
  background: {
    default: '#F4F6F8',
    paper: white,
  },
  icon: colors.blueGrey[600],
  divider: colors.grey[200],
};
