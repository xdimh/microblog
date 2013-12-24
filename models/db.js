var settings = require('../setting');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;

module.exports = new Db(settings.db, new Server(settings.host,Connection.DEFAULT_PORT,{}));