"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProvincias = exports.ImportarNomencladores = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _connection = require("../database/connection");
var _nodeLocalstorage = require("node-localstorage");
var _config = _interopRequireDefault(require("../config"));
var _tedious = _interopRequireDefault(require("tedious"));
var localStorage = new _nodeLocalstorage.LocalStorage('./scratch');
var TYPES = require('tedious').TYPES;
var _require = require('tedious'),
  Connection = _require.Connection,
  Request = _require.Request;

//Obtener Provincias
var getProvincias = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var pool;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return (0, _connection.getConnection)();
          case 3:
            pool = _context2.sent;
            //console.log(pool);
            pool.connect(function (err) {
              var request = new Request('SELECT  * FROM dbo.TEPROVINCIA', /*#__PURE__*/function () {
                var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(err, rowCount, rows) {
                  var jsonArray;
                  return _regenerator["default"].wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          jsonArray = [];
                          rows.forEach(function (columns) {
                            var rowObject = {};
                            columns.forEach(function (column) {
                              rowObject[column.metadata.colName] = column.value;
                            });
                            jsonArray.push(rowObject);
                          });
                          jsonArray.push({
                            total: rowCount
                          });
                          res.json(jsonArray);
                        case 4:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));
                return function (_x3, _x4, _x5) {
                  return _ref2.apply(this, arguments);
                };
              }());
              pool.execSql(request);
            });
            _context2.next = 11;
            break;
          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            res.status(500);
            res.send(_context2.t0.message);
          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));
  return function getProvincias(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

//Crear Provincias
exports.getProvincias = getProvincias;
var ImportarNomencladores = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var peticion, peticionNameNom, sqlGeneralExist, sqlGeneralNomExist, _sqlGeneralExist, _sqlGeneralNomExist, _sqlGeneralExist2, _sqlGeneralNomExist2, pool, executeSQLIfExist, executeSQLIfNotExist, executeSQLDesHabilitarTrigger;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            peticion = req.body['content'];
            peticionNameNom = req.body['name'];
            sqlGeneralExist = '';
            sqlGeneralNomExist = '';
            if (peticionNameNom === 'PROV') {
              /* SQL PROVINCIA */
              _sqlGeneralExist = 'if exists (SELECT ProvCod FROM TEPROVINCIA WHERE (ProvCod = @provCod)) UPDATE dbo.TEPROVINCIA SET ProvNombre = @provNombre WHERE (ProvCod = @provCod)';
              _sqlGeneralNomExist = 'if not exists (SELECT ProvCod FROM TEPROVINCIA WHERE (ProvCod = @provCod)) INSERT INTO dbo.TEPROVINCIA (ProvCod,ProvNombre) VALUES (@provCod,@provNombre)';
            }
            if (peticionNameNom === 'ORGANISMO') {
              /* SQL ORGANISMO */
              _sqlGeneralExist2 = 'if exists (SELECT OrganCodigo FROM TEORGANISMO WHERE (OrganCodigo = @organCodigo)) UPDATE dbo.TEORGANISMO SET OrganDescripcion = @organDescripcion,OrganActivo = @organActivo WHERE (OrganCodigo = @organCodigo)';
              _sqlGeneralNomExist2 = 'if not exists (SELECT OrganCodigo FROM TEORGANISMO WHERE (OrganCodigo = @organCodigo)) INSERT INTO dbo.TEORGANISMO (OrganCodigo,OrganDescripcion,OrganEI,OrganUI,OrganFechaModif,OrganActivo) VALUES (@organCodigo,@organDescripcion,@organEI,@organUI,@organFechaModif,@organActivo)';
            }
            _context3.next = 8;
            return (0, _connection.getConnection)();
          case 8:
            pool = _context3.sent;
            pool.connect(function (err) {
              // Deshabilitar triger
              var requestDesTrigg = new Request("if   exists (SELECT name FROM sys.triggers WHERE (name = N'SMA_Event') AND (parent_class_desc = N'DATABASE')) disable TRIGGER SMA_Event ON DATABASE", function (err, rowCount, rows) {
                if (err) {
                  res.json("Error Deshabilitar Trigger ".concat(err));
                } else {
                  pool.close();
                  // Update Values
                  for (var j in peticion) {
                    executeSQLIfExist(peticionNameNom, peticion[j], sqlGeneralExist, function (err, data) {
                      console.log(sqlGeneralExist);
                      if (err) {
                        res.json("Error Insertar si existe en Nomenclador: ".concat(peticionNameNom, " , error: ").concat(err));
                      }
                    });
                    executeSQLIfNotExist(peticionNameNom, peticion[j], sqlGeneralNomExist, function (err, data) {
                      console.log(sqlGeneralNomExist);
                      if (err) {
                        res.json("Error Insertar si no existe en Nomenclador: ".concat(peticionNameNom, " , error: ").concat(err));
                      }
                    });
                  }
                  executeSQLDesHabilitarTrigger("if exists (SELECT name FROM sys.triggers WHERE (name = N'SMA_Event') AND (parent_class_desc = N'DATABASE')) enable TRIGGER SMA_Event ON DATABASE", function (err, data) {
                    if (err) {
                      res.json("Error Habilitar Trigger ".concat(err));
                    }
                  });
                }
              });
              pool.execSql(requestDesTrigg);
            });
            executeSQLIfExist = function executeSQLIfExist(nomName, j, sql, callback) {
              console.log(sql);
              var connectionGeneral = new Connection({
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
                  rowCollectionOnRequestCompletion: true
                }
              });
              connectionGeneral.connect(function (err) {
                if (err) return callback(err, null);
                var request = new Request(sql, function (err, rowCount, rows) {
                  connectionGeneral.close();
                  if (err) return callback(err, null);
                  callback(null, {
                    rowCount: rowCount,
                    rows: rows
                  });
                });

                //console.log(j)
                //Parametros Nom Provincia
                if (nomName === 'PROV') {
                  request.addParameter('provCod', TYPES.Int, j['ProvCod']);
                  request.addParameter('provNombre', TYPES.VarChar, j['ProvNombre']);
                }
                if (nomName === 'ORGANISMO') {
                  request.addParameter('organCodigo', TYPES.Int, j['OrganCodigo']);
                  request.addParameter('organDescripcion', TYPES.VarChar, j['OrganDescripcion']);
                  request.addParameter('organEI', TYPES.SmallInt, j['OrganEI']);
                  request.addParameter('organUI', TYPES.SmallInt, j['OrganUI']);
                  request.addParameter('organFechaModif', TYPES.Date, j['OrganFechaModif']);
                  request.addParameter('organActivo', TYPES.Numeric, j['OrganActivo']);
                }
                connectionGeneral.execSql(request);
              });
            };
            executeSQLIfNotExist = function executeSQLIfNotExist(nomName, j, sql, callback) {
              console.log(sql);
              var connectionGeneral = new Connection({
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
                  rowCollectionOnRequestCompletion: true
                }
              });
              connectionGeneral.connect(function (err) {
                if (err) return callback(err, null);
                var request = new Request(sql, function (err, rowCount, rows) {
                  connectionGeneral.close();
                  if (err) return callback(err, null);
                  callback(null, {
                    rowCount: rowCount,
                    rows: rows
                  });
                });

                //PROVINCIAS
                if (nomName === 'PROV') {
                  request.addParameter('provCod', TYPES.Int, j['ProvCod']);
                  request.addParameter('provNombre', TYPES.VarChar, j['ProvNombre']);
                }
                //ORGANISMO
                if (nomName === 'ORGANISMO') {
                  request.addParameter('organCodigo', TYPES.Int, j['OrganCodigo']);
                  request.addParameter('organDescripcion', TYPES.VarChar, j['OrganDescripcion']);
                  request.addParameter('organEI', TYPES.SmallInt, j['OrganEI']);
                  request.addParameter('organUI', TYPES.SmallInt, j['OrganUI']);
                  request.addParameter('organFechaModif', TYPES.Date, j['OrganFechaModif']);
                  request.addParameter('organActivo', TYPES.Numeric, j['OrganActivo']);
                }
                connectionGeneral.execSql(request);
              });
            };
            executeSQLDesHabilitarTrigger = function executeSQLDesHabilitarTrigger(sql, callback) {
              var connectionGeneral = new Connection({
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
                  rowCollectionOnRequestCompletion: true
                }
              });
              connectionGeneral.connect(function (err) {
                if (err) return callback(err, null);
                var request = new Request(sql, function (err, rowCount, rows) {
                  connectionGeneral.close();
                  if (err) return callback(err, null);
                  callback(null, {
                    rowCount: rowCount,
                    rows: rows
                  });
                });
                connectionGeneral.execSql(request);
              });
            };
            res.json('Importado Nomenclador OK');
          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return function ImportarNomencladores(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();
exports.ImportarNomencladores = ImportarNomencladores;