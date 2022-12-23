const express = require('express');
const reseacherRouter = require('./routes/researcherRoutes');
const articleRouter = require('./routes/articleRoutes');
const adminRouter = require('./routes/adminRoutes');
const compression = require('compression');
const app = express();
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(compression());
app.use('/api/v1/researchers', reseacherRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/admin', adminRouter);
module.exports = app;
