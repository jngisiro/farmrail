import app from './app';

import mongoose from 'mongoose';

import config from './config';

mongoose
  .connect(config.databaseUrl[config.environment], {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('connected to db'));

app.listen(config.port, () => console.log(`server is Up and running on port:${config.port}`));
