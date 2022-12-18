"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dbSettings = void 0;
exports.getConnection = getConnection;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mssql = _interopRequireDefault(require("mssql"));
var _tedious = _interopRequireDefault(require("tedious"));
var _nodeLocalstorage = require("node-localstorage");
var localStorage = new _nodeLocalstorage.LocalStorage('./scratch');
var Connection = require('tedious').Connection;
// Conection con tedious
var ConnectionPool = require('tedious-connection-pool');

//console.log(localStorage.getItem('userName'));

var dbSettings = {
  server: localStorage.getItem('server'),
  authentication: {
    type: 'default',
    options: {
      userName: localStorage.getItem('userName'),
      password: localStorage.getItem('password'),
      instanceName: localStorage.getItem('instanceName'),
      port: 1433
    }
  },
  options: {
    database: localStorage.getItem('database'),
    encrypt: false,
    tdsVersion: '7_3_B',
    rowCollectionOnRequestCompletion: true,
    connectTimeout: 300000,
    requestTimeout: 300000
  }
};
//console.log(dbSettings)
// coneccion con Tedious
exports.dbSettings = dbSettings;
function getConnection() {
  return _getConnection.apply(this, arguments);
}
function _getConnection() {
  _getConnection = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var pool;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return new Connection(dbSettings);
          case 3:
            pool = _context.sent;
            return _context.abrupt("return", pool);
          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);
          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));
  return _getConnection.apply(this, arguments);
}