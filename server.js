var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');

var config = require('config');
var apiRoutes = require('./routes/api');
var viewRoutes = require('./routes/public').router;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('assets'));

var port = process.env.PORT || 8080;
var DB_URI = process.env.database || config.database;

var isConnectedBefore = false;
var connect = function() {
  return mongoose.connect(DB_URI, {server: { auto_reconnect: true }}, function(err) {
    if (err) {
      console.error('Failed to connect to mongo...', err);
    }
  });
};
connect();

mongoose.connection.on('error', function(error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

mongoose.connection.on('error', function() {
    console.log('Could not connect to MongoDB');
});

mongoose.connection.on('disconnected', function(){
    console.log('Lost MongoDB connection...');
    mongoose.connect(DB_URI, {server:{auto_reconnect:true, socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }}, replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }});
});
mongoose.connection.on('connected', function() {
	isConnectedBefore = true;
    console.log('Connection established to MongoDB');
});

mongoose.connection.on('reconnected', function() {
    console.log('Reconnected to MongoDB');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Force to close the MongoDB conection');
        process.exit(0);
    });
});

mongoose.Promise = global.Promise;

app.set('superSecret', config.secret);
app.set('view engine', 'ejs');
if(config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('combined'));
}
app.use('/api', apiRoutes);
app.use('/', viewRoutes);

app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app;