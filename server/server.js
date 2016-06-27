
var express = require('express'),
    http = require('http'),
    path = require('path'),
    routes = require('./routes'),
    pkg = require('../package.json'),
  debug = require('debug')('express');

var app = express();

app.set('port', process.env.PORT || 9000);

app.use(express.static(path.join(__dirname, '..', 'src')));


app.get('/'+pkg.base+'/static/*', routes.static);
app.get('/'+pkg.base+'/', routes.index);
app.get('/'+pkg.base+'/*', routes.index);

module.exports = app;
