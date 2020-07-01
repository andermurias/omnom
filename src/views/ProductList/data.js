import uuid from 'uuid/v1';

const types = {
  product: 'Product',
  tool: 'Tool',
};

export default [
  {
    id: uuid(),
    title: 'Dayl',
    type: types.product,
    description: 'Small tool to log all your task you have done in your day',
    imageUrl: '/images/products/product_1.png',
    target: 'https://dayl.om.nom.es',
    github: '#',
  },
  {
    id: uuid(),
    title: 'CSV Teamwork Importer',
    type: types.tool,
    description: 'Import your your time entries to teamwork from a csv file',
    imageUrl: '/images/products/product_2.png',
    target: '/importer/teamwork',
    github: '#',
  },
  {
    id: uuid(),
    title: 'IRO',
    type: types.tool,
    description: 'Create your color palletes to your projects',
    imageUrl: '/images/products/product_3.png',
    target: '/iro',
    github: '#',
  },
];
