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
var staticRoot = __dirname + '/';

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
