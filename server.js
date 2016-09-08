var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');

var config = require('config');
var apiRoutes = require('./routes/api');
var viewRoutes = require('./routes/public');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('assets'));

var port = process.env.PORT || 8080;

mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.set('superSecret', config.secret);
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
app.set('view engine', 'ejs');
if(config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('combined'));
}
app.use('/api', apiRoutes);
app.use('/', viewRoutes);

app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app;