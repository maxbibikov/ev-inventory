require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
const cloudinary = require('cloudinary').v2;

const indexRouter = require('./routes/index');
const inventoryRouter = require('./routes/inventory');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const app = express();
app.use(helmet());
const MONGODB_DEV_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-bbns4.gcp.mongodb.net/local_ev_inventory?retryWrites=true&w=majority`;
const mongoDB = process.env.MONGODB_URI || MONGODB_DEV_URL;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDB connection error'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/inventory', inventoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
