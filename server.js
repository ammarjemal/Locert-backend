const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    // to connect to local database
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    // console.log('DB connection successful');
  })
  .catch((e) => {
    // console.log(e);
  });
const port = process.env.port || 8001;


app.listen(port, () => {
  // console.log(`App running at port number ${port}`);
});
