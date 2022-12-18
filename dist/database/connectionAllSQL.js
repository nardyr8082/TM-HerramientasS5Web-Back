"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mssql = _interopRequireDefault(require("mssql"));
var dbSettings = {
  user: 'sa',
  password: 'Sasql2008',
  server: 'localhost',
  database: 'CubalubGranma',
  port: 1433,
  options: {
    instanceName: 'sql2008r2',
    trustServerCertificate: true,
    encrypt: true,
    tdsVersion: '7_3_B',
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1'
    }
  }
};
function getConnection() {
  return _getConnection.apply(this, arguments);
}
function _getConnection() {
  _getConnection = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var pool, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _mssql["default"].connect(dbSettings);
          case 2:
            pool = _context.sent;
            console.log(pool);
            _context.next = 6;
            return pool.request().query('SELECT 1');
          case 6:
            result = _context.sent;
          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getConnection.apply(this, arguments);
}
getConnection();