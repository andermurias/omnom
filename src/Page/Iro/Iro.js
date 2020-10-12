import React, {useState, useReducer, useContext} from 'react';
import {makeStyles} from '@material-ui/styles';

import {Typography, Card, CardContent, CardHeader, Grid, TextField, Button, InputAdornment} from '@material-ui/core';
import ColorsTable from '../../Component/ColorsTable/ColorsTable';
import ImageCanvasColor from '../../Component/ImageCanvasColor/ImageCanvasColor';

import * as ntc from 'ntc';
import {AppContext} from '../../_context/AppContext';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
  },
  spacer: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  monospaced: {
    padding: theme.spacing(2),
    textAlign: 'left',
    display: 'block',
    width: '100%',
    // backgroundColor: '#EEE',
    borderLeft: 'solid 1px',
    // eslint-disable-next-line quotes
    fontFamily: "'IBM Plex Mono', monospace",
  },
}));

const Iro = () => {
  const classes = useStyles();

  const {setTitle} = useContext(AppContext);
  setTitle('IRO');

  const getColors = () => {
    const storageColorsJson = localStorage.getItem('colors');
    let storageColors = [];
    if (storageColorsJson !== null && storageColorsJson.length !== 0) {
      storageColors = JSON.parse(storageColorsJson);
    }
    return storageColors;
  };

  const [colors, setColors] = useReducer((past, current) => {
    let stateColors = [];
    if (current) {
      stateColors = [...past, current];
      localStorage.setItem('colors', JSON.stringify(stateColors));
    }
    return stateColors;
  }, getColors());
  const [inputColor, setInputColor] = useState('');

  const addColor = (color) => {
    setColors(color);

    setInputColor('');
  };

  const clearColors = () => {
    setColors(null);
    localStorage.setItem('colors', JSON.stringify([]));
  };

  const searchColor = (colorToSearch) => {
    if (colorToSearch.length === 6) {
      const hexColor = `#${colorToSearch.toUpperCase()}`,
        // Find the nearest match
        match = ntc.name(hexColor),
        // The resulting array
        baseName = match[1].toLowerCase().replace(' ', '-'),
        row = {
          color: hexColor,
          name: match[1],
          closest: match[0],
          less: `@color-${baseName}: ${hexColor};`,
          sass: `$color-${baseName}: ${hexColor};`,
          css: `--color-${baseName}: ${hexColor};`,
        };

      addColor(row);
    } else {
      // eslint-disable-next-line no-alert
      alert('You only shoud specify the color hex value (FFFFFF)');
    }
  };

  const search = () => {
    searchColor(inputColor);
  };

  const hexColorInputKeyPress = (e) => {
    if (e.nativeEvent.keyCode === 13) {
      search();
      return false; // <---- Add this line
    }
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="subtitle1">
        This tool will let you work with colors and pick them from images or create your onw pallete with color names
      </Typography>
      <ImageCanvasColor searchColor={searchColor} />
      <Card className={classes.content}>
        <CardHeader title={'Input colors manually'} />
        <CardContent>
          <Grid container spacing={1}>
            <Grid container item md={10} xs={12}>
              <TextField
                fullWidth
                id="teamwork-importer-user"
                InputProps={{
                  startAdornment: <InputAdornment position="start">#</InputAdornment>,
                }}
                label="Color"
                onChange={(e) => setInputColor(e.target.value)}
                onKeyPress={hexColorInputKeyPress}
                placeholder="Hex Color (#C43424)"
                value={inputColor}
                variant="outlined"
              />
            </Grid>
            <Grid container item md={2} xs={12}>
              <Button color="primary" fullWidth onClick={search} variant="contained">
                Search Color
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card className={classes.content}>
        <CardContent>
          <Grid container spacing={1}>
            <Grid container item xs={12}>
              <Button color="primary" fullWidth onClick={clearColors} variant="outlined">
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {colors.length ? (
        <>
          <ColorsTable className={classes.content} colors={colors}></ColorsTable>
          <Card className={classes.content}>
            <CardHeader title={'Export'} />
            <CardContent>
              <Grid container spacing={1}>
                <Grid container item md={4} xs={12}>
                  <Typography variant="h6">Less</Typography>
                  <span
                    className={classes.monospaced}
                    dangerouslySetInnerHTML={{
                      __html: colors.map((color) => color.less).reduce((carry, color) => `${carry}<br />${color}`),
                    }}
                  />
                </Grid>
                <Grid container item md={4} xs={12}>
                  <Typography variant="h6">Sass</Typography>
                  <span
                    className={classes.monospaced}
                    dangerouslySetInnerHTML={{
                      __html: colors.map((color) => color.sass).reduce((carry, color) => `${carry}<br />${color}`),
                    }}
                  />{' '}
                </Grid>
                <Grid container item md={4} xs={12}>
                  <Typography variant="h6">CSS</Typography>
                  <span
                    className={classes.monospaced}
                    dangerouslySetInnerHTML={{
                      __html: colors.map((color) => color.css).reduce((carry, color) => `${carry}<br />${color}`),
                    }}
                  />{' '}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default Iro;
