import React, {useState} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Grid, Typography, Divider} from '@material-ui/core';

import {ProductCard} from './components';
import mockData from './data';

const useStyles = makeStyles((theme) => ({
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
          <Grid item xs={8}>
            <Typography variant="h1">Welcome to om.nom.es</Typography>
            <Typography variant="h6">
              All omnom tools are free, you can use them, download, check their code or host your onw, just check their
              repositories
            </Typography>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {products
            .sort((a, b) => (a.title > b.title ? 1 : -1))
            .map((product) => (
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
