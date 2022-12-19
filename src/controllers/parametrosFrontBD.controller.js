"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parametros = void 0;
var _tedious = _interopRequireDefault(require("tedious"));
var _nodeLocalstorage = require("node-localstorage");
// Aqui se resiven los parametros de conexion para la BD que vienen del fronted

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var localStorage = new _nodeLocalstorage.LocalStorage('./scratch');
var connection;
var Parametros = function Parametros(req, res) {
  if (req) {
var parametros = req.body;
var dbSettings = {
      server: parametros['server'],
      authentication: {
        type: 'default',
        options: {
          userName: parametros['userName'],
          password: parametros['password'],
          instanceName: parametros['instanceName'],
          port: 1433
        }
      },
      options: {
        database: parametros['database'],
        encrypt: false,
        tdsVersion: '7_3_B',
        rowCollectionOnRequestCompletion: true,
        connectTimeout: 300000,
        requestTimeout: 300000
      }
    };
    connection = new Connection(dbSettings);
    /* console.log(connection); */

    connection.on('connect', function (err) {
      if (err) {
        res.json("Conexion Incorrecta. Verifique todos los parametros ".concat(err));
        console.error(err);
      } else {
        var request = new Request('Select * from dbo.ALMACENID', function (err, rowCount) {
          if (err) {
            console.error(err);
            res.json("Base de Datos Incorrecta. ".concat(err));
          }
          connection.close();
        });
        connection.execSql(request);
        res.json('Conexion correcta..');
      }
    });
    connection.connect();
  }
  //process.exit(1)
};
exports.Parametros = Parametros;