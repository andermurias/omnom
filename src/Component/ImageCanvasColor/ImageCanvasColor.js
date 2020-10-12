import React, {useRef, useState} from 'react';
import {CardContent, Grid, CardHeader, Card, Switch, FormControlLabel, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';

import classnames from 'classnames';
import ColorThief from 'colorthief';

const useStyles = makeStyles((theme) => ({
  fileInput: {
    display: 'none',
  },
  fileLabel: {
    width: '100%',
  },
  canvas: {
    width: '100%',
    height: 0,
    cursor: 'crosshair',
  },
  magnify: {
    position: 'fixed',
    right: 150,
    bottom: -400,
    border: 'solid 1px #ddd',
    borderBottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
    display: 'flex',
    flexFlow: 'column',
    pointerEvents: 'none',
    transition: theme.transitions.create('all'),
  },
  magnifyVisible: {
    opacity: 1,
    bottom: 0,
  },
  magnifyContent: {
    position: 'relative',
    display: 'flex',
    width: 215,
    height: 215,
    justifyContent: 'center',
    alignItems: 'center',
    '&::after': {
      display: 'flex',
      width: 15,
      height: 15,
      // eslint-disable-next-line quotes
      content: "''",
      border: 'solid 5px #000',
      opacity: '.5',
    },
  },
  magnifyCanvas: {
    width: 215,
    height: 215,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  magnifyColor: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // eslint-disable-next-line quotes
    fontFamily: "'IBM Plex Mono', monospace",
  },
}));

const ImageCanvasColor = ({searchColor}) => {
  const classes = useStyles();

  const magnify = useRef(null);
  const magnifyColor = useRef(null);
  const magnifyCanvas = useRef(null);
  const canvas = useRef(null);

  const [magnifyVisible, setMagnifyVisible] = useState(false);
  const [getColorsAutomatically, setGetColorsAutomatically] = useState(false);
  const [canvasSize, setCanvasSize] = useState([0, '100%']);

  const handleGetColorsAutomatically = (e) => setGetColorsAutomatically(e.target.checked);

  const onCanvasMouseMove = (e) => {
    var context = canvas.current.getContext('2d');

    // const rect = canvas.current.getBoundingClientRect();
    const x = e.nativeEvent.layerX;
    const y = e.nativeEvent.layerY;

    // Get the data of the pixel according to the location generate by the getEventLocation function
    const pixelData = context.getImageData(x, y, 1, 1).data,
      magnifyCtx = magnifyCanvas.current.getContext('2d'),
      magnifyHeight = 215,
      magnifyWidth = 215;

    magnifyCanvas.current.height = magnifyHeight;
    magnifyCanvas.current.width = magnifyWidth;
    magnifyCtx.drawImage(canvas.current, x - 10, y - 10, 20, 20, 0, 0, magnifyHeight, magnifyWidth);

    const hexNum = rgbToHex(pixelData);
    const hex = `#${hexNum}`;

    magnifyColor.current.style.backgroundColor = hex;
    magnifyColor.current.style.color = `#${invertHex(hexNum)}`;
    magnifyColor.current.innerHTML = hex;
    if (!magnifyVisible) {
      setMagnifyVisible(true);
    }
  };

  const onCanvasClick = (e) => {
    var context = canvas.current.getContext('2d');
    const rect = canvas.current.getBoundingClientRect();
    const x = e.nativeEvent.clientX - rect.left;
    const y = e.nativeEvent.clientY - rect.top;
    const pixelData = context.getImageData(x, y, 1, 1).data;
    searchColor(rgbToHex(pixelData));
  };

  const invertHex = (hexnum) => {
    hexnum = hexnum.toUpperCase();
    var splitnum = hexnum.split(''),
      resultnum = '',
      simplenum = 'FEDCBA9876'.split(''),
      complexnum = {
        A: '5',
        B: '4',
        C: '3',
        D: '2',
        E: '1',
        F: '0',
      };

    for (let i = 0; i < 6; i++) {
      if (!isNaN(splitnum[i])) {
        resultnum += simplenum[splitnum[i]];
      } else if (complexnum[splitnum[i]]) {
        resultnum += complexnum[splitnum[i]];
      }
    }

    return resultnum;
  };

  const readURL = (e) => {
    const input = e.currentTarget;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = (loadEvent) => {
        var colorThief = new ColorThief(),
          image = new Image();
        image.onload = () => {
          const ratio = canvas.current.clientWidth / image.width;
          const width = image.width * ratio;
          const height = image.height * ratio;
          canvas.current.height = height;
          canvas.current.width = width;
          setCanvasSize([height, width]);
          canvas.current.getContext('2d').drawImage(image, 0, 0, width, height);

          if (getColorsAutomatically) {
            const automaticColors = colorThief.getPalette(image, 10);
            for (const i in automaticColors) {
              searchColor(rgbToHex(automaticColors[i]));
            }
          }
        };
        image.src = loadEvent.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  const componentToHex = (c) => {
    var hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  const rgbToHex = (color) => {
    var r = color[0],
      g = color[1],
      b = color[2];
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
  };

  return (
    <>
      <Card>
        <CardHeader title={'Get Colos From Image'} />
        <CardContent>
          <Grid container spacing={1}>
            <Grid container item md={10} xs={12}>
              <input
                accept=".jpg"
                className={classes.fileInput}
                id="teamwork-importer-files"
                multiple
                onChange={readURL}
                type="file"
              />
              <label className={classes.fileLabel} htmlFor="teamwork-importer-files">
                <Button component="span" fullWidth variant="outlined">
                  Select files
                </Button>
              </label>
            </Grid>
            <Grid container item md={2} xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={getColorsAutomatically}
                    color="primary"
                    inputProps={{'aria-label': 'secondary checkbox'}}
                    name="Get Colors Automatically"
                    onChange={handleGetColorsAutomatically}
                  />
                }
                label="Get Colors Automatically"
              />
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid container item xs={12}>
              <canvas
                className={classes.canvas}
                onBlur={() => setMagnifyVisible(false)}
                onClick={onCanvasClick}
                onMouseMove={onCanvasMouseMove}
                onMouseOut={() => setMagnifyVisible(false)}
                ref={canvas}
                style={{height: canvasSize[0], width: canvasSize[1]}}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <div className={classnames({[classes.magnify]: true, [classes.magnifyVisible]: magnifyVisible})} ref={magnify}>
        <div className={classes.magnifyContent}>
          <canvas className={classes.magnifyCanvas} ref={magnifyCanvas} />
        </div>
        <div
          className={classes.magnifyColor}
          ref={magnifyColor}
          style={{backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(255, 255, 255)'}}
        >
          #000000
        </div>
      </div>
    </>
  );
};

export default ImageCanvasColor;
