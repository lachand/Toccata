/**var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var app = express();
app.use(express.static(__dirname));
app.use(morgan('dev'));
app.use(gzippo.staticGzip("" + __dirname + "/dist/"));
app.listen(process.env.PORT || 5000);
 **/
var express = require('express'),
  path = require('path'),
  fs = require('fs');

var app = express();
var staticRoot = 'dist/';

app.set('port', (process.env.PORT || 3000));

app.use(express.static(staticRoot));

app.use(function(req, res, next){

  // if the request is not html then move along
  var accept = req.accepts('html', 'json', 'xml');
  if(accept !== 'html'){
    return next();
  }

  // if the request has a '.' assume that it's for a file, move along
  var ext = path.extname(req.path);
  if (ext !== ''){
    return next();
  }

  fs.createReadStream(staticRoot + 'index.html').pipe(res);

});

//app.all('/*', function(req, res, next) {
//    res.sendFile('index.html', { root: __dirname + '/' });
//});

app.listen(app.get('port'), function() {
  console.log('app running on port', app.get('port'));
});


// SuperLogin configuration :
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var logger = require('morgan');
var SuperLogin = require('superlogin');

var appSuperLogin = express();
appSuperLogin.set('port', process.env.PORT || 3000);
appSuperLogin.use(logger('dev'));
appSuperLogin.use(bodyParser.json());
appSuperLogin.use(bodyParser.urlencoded({extended: false}));

var config = {
  dbServer: {
    protocol: 'http://',
    host: '163.172.38.12:5984',
    user: '',
    password: '',
    userDB: 'sl-users',
    couchAuthDB: '_users'
  },
  mailer: {},
  userDBs: {
    defaultDBs: {
      private: ['user']
    }
  }
}

// Initialize SuperLogin
var superlogin = new SuperLogin(config);

// Mount SuperLogin's routes to our app
appSuperLogin.use('/auth', superlogin.router);

http.createServer(appSuperLogin).listen(appSuperLogin.get('port'));
