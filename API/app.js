
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const authController = require('./auth/authController');
const verifytoken = require('./auth/verifytoken');
const indexRouter = require('./routes/index');
const companyRouter = require('./routes/company');
const dictionaryRouter = require('./routes/dictionary');
const chemicalRouter = require('./routes/chemical');
const contactprofileRouter = require('./routes/contactprofile');
const cropRouter = require('./routes/crop');
const diseaseRouter = require('./routes/disease');
const pestRouter = require('./routes/pest');
const sensorRouter = require('./routes/sensor');
const subscriptionRouter = require('./routes/subscription');
const contactaccessRouter = require('./routes/contactaccess');
const companyaccessRouter = require('./routes/companyaccess');
const phoneRouter = require('./routes/phone');
const emailRouter = require('./routes/email');
const locationRouter = require('./routes/location');
const irrigationRouter = require('./routes/irrigation');
const irrigationlocationRouter = require('./routes/irrigationlocation');
const watersourceRouter = require('./routes/watersource');
const watersourcelocationRouter = require('./routes/watersourcelocation');

const app = express();
const router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public  
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));  

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//   next();
// });


app.use('/', indexRouter);
//app.use('/api/company', verifytoken, companyRouter);

app.use('/api/company', companyRouter);
app.use('/api/dictionary', dictionaryRouter);
app.use('/api/chemical', chemicalRouter);
app.use('/api/contactprofile', contactprofileRouter);
app.use('/api/crop', cropRouter);
app.use('/api/disease', diseaseRouter);
app.use('/api/pest', pestRouter);
app.use('/api/sensor', sensorRouter);
app.use('/api/subscription', subscriptionRouter);
app.use('/api/contactaccess', contactaccessRouter);
app.use('/api/companyaccess', companyaccessRouter);
app.use('/api/phone', phoneRouter);
app.use('/api/email', emailRouter);
app.use('/api/location', locationRouter);
app.use('/api/irrigation', irrigationRouter);
app.use('/api/irrigationlocation', irrigationlocationRouter);
app.use('/api/watersource', watersourceRouter);
app.use('/api/watersourcelocation', watersourcelocationRouter);
app.post('/api/authenticate', authController);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, function () {
  console.log('Listening on port ' + port);
});

module.exports = app;
