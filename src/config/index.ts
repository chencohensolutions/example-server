import development from './development';
import production from './production';
import staging from './staging';

const configAssoc = { development, production, staging };

let NODE_ENV = process.env.NODE_ENV || 'development';
console.log('NODE_ENV', NODE_ENV);

const config = configAssoc[NODE_ENV];

export default config;
