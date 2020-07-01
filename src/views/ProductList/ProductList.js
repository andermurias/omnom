import React, {useState} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Grid, Typography} from '@material-ui/core';

import {ProductCard} from './components';
import mockData from './data';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

const ProductList = () => {
  const classes = useStyles();

  const [products] = useState(mockData);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h1">Welcome to om.nom.es</Typography>
            <Typography variant="h6">All of theme are free, All of theme can be found at Github</Typography>
          </Grid>
          {products
            .sort((a, b) => (a.title > b.title ? 1 : -1))
            .map(product => (
              <Grid item key={product.id} lg={3} md={6} xs={12}>
                <ProductCard product={product} />
              </Grid>
            ))}
        </Grid>
      </div>
    </div>
  );
};

export default ProductList;
