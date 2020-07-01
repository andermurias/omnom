import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Divider,
  Button,
  colors,
  CardHeader,
  Avatar,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  imageContainer: {
    height: theme.spacing(8),
    width: theme.spacing(8),
    borderRadius: 5,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    border: 'solid 1px',
    borderColor: colors.grey[300],
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  image: {
    width: '100%',
  },
  statsItem: {
    display: 'flex',
    alignItems: 'center',
  },
  statsIcon: {
    color: theme.palette.icon,
    marginRight: theme.spacing(1),
  },
  avatar: {
    backgroundColor: colors.red[300],
  },
}));

const ProductCard = props => {
  const {className, product, ...rest} = props;

  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {product.title.charAt(0)}
          </Avatar>
        }
        subheader={product.type}
        title={
          <Typography align="left" variant="h5">
            {product.title}
          </Typography>
        }
      ></CardHeader>
      <CardContent>
        {/* <div className={classes.imageContainer}>
          <img alt="Product" className={classes.image} src={product.imageUrl} />
        </div> */}
        {/* <Typography align="left" gutterBottom variant="h2">
          {product.title}
        </Typography> */}
        <Typography align="left" variant="body1">
          {product.description}
        </Typography>
      </CardContent>
      <Divider variant="middle"></Divider>
      <CardActions>
        <Grid container justify="space-between">
          <Grid className={classes.statsItem} item>
            <Button color="primary" component="a" href={product.target} size="small">
              See more
            </Button>
            <Button color="primary" component="a" href={product.github} size="small">
              Github Repository
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired,
};

export default ProductCard;
