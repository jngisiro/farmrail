const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const config = require('./config');

dotenv.config();

// connect to db
mongoose
  .connect(config.databaseUrl[config.environment], {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('connected to db'));

app.listen(3000, () => console.log(`server is Up and running on port:${config.port}`));
