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
var _coreRestPipeline = require("@azure/core-rest-pipeline");
var localStorage = new _nodeLocalstorage.LocalStorage('./scratch');
var TYPES = require('tedious').TYPES;
var _require = require('tedious'),
  Connection = _require.Connection,
  Request = _require.Request;

// Obtener Provincias
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
            // console.log(pool);
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

// Crear Provincias
exports.getProvincias = getProvincias;
var ImportarNomencladores = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var peticion,
     peticionNameNom,
     sqlGeneralExist,
     sqlGeneralNomExist, 
     sqlValidacion, 
     result, 
     configdb,
     configdbAll,
     pool, 
     executeStatement, 
     executeSQLIfExist, 
     executeSQLIfNotExist,
     executeSQLHabilitarTrigger;
     configdb=req.body['configdb']
            
     localStorage.removeItem('server');
     localStorage.removeItem('userName');
     localStorage.removeItem('password');
     localStorage.removeItem('instanceName');
     localStorage.removeItem('database');
  
     localStorage.setItem('server', configdb['server']);
     localStorage.setItem('userName', configdb['userName']);
     localStorage.setItem('password', configdb['password']);
     localStorage.setItem('instanceName', configdb['instanceName']);
     localStorage.setItem('database', configdb['database']);
     
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            executeStatement = function _executeStatement() {
              var requestDesTrigg = new Request("if   exists (SELECT name FROM sys.triggers WHERE (name = N'SMA_Event') AND (parent_class_desc = N'DATABASE')) disable TRIGGER SMA_Event ON DATABASE", function (err, rowCount, rows) {
                if (err) {
                  throw "Error Deshabilitar Trigger ".concat(err);
                } else {
                  pool.close();
                  // Update Values
                  var _loop = function _loop(j) {
                    executeSQLIfExist(peticionNameNom, peticion[j], sqlGeneralExist, function (err, data) {
                      if (j === peticion.length - 1) {
                        if (res.headersSent !== true) {
                          if (err) {
                            res.json("Error Insertar si existe en Nomenclador: ".concat(peticionNameNom, " , ").concat(err, ", dato: ").concat(data));
                          }
                          if (data) {
                            res.json("Importado Nomenclador OK");
                          }
                        }
                      }
                    });
                    executeSQLIfNotExist(peticionNameNom, peticion[j], sqlGeneralNomExist, function (err, data) {
                      if (j === peticion.length - 1) {
                        /* console.log(data)
                        console.log(err) */
                        if (res.headersSent !== true) {
                          if (err) {
                            res.json("Error Insertar si no existe en Nomenclador: ".concat(peticionNameNom, " , error: ").concat(err));
                          }
                          if (data) {
                            res.json("Importado Nomenclador OK");
                          }
                        }
                      }
                    });
                  };
                  for (var j = 0; j < peticion.length; j++) {
                    _loop(j);
                  }
                  executeSQLHabilitarTrigger("if exists (SELECT name FROM sys.triggers WHERE (name = N'SMA_Event') AND (parent_class_desc = N'DATABASE')) enable TRIGGER SMA_Event ON DATABASE", function (err, data) {
                    if (err) {
                      throw "Error Habilitar Trigger ".concat(err);
                    }
                  });
                }
              });
              pool.execSql(requestDesTrigg);
            };
            
            configdb=req.body['configdb']
            configdbAll={
              server: configdb['server'],
              authentication: {
                type: 'default',
                options: {
                  userName: configdb['userName'],
                  password: configdb['password'],
                  instanceName: configdb['instanceName'],
                  port: 1433
                }
              },
              options: {
                database: configdb['database'],
                encrypt: false,
                tdsVersion: '7_3_B',
                rowCollectionOnRequestCompletion: true,
                connectTimeout: 300000,
                requestTimeout: 300000
              }
            }
            peticion = req.body['content'];
            peticionNameNom = req.body['name'];
            sqlGeneralExist = '';
            sqlGeneralNomExist = '';
            sqlValidacion = '';
            result = [];
            if (peticionNameNom === 'PROV') {
              /* SQL PROVINCIA */
              sqlGeneralExist = 'if exists (SELECT ProvCod FROM TEPROVINCIA WHERE (ProvCod = @provCod)) UPDATE dbo.TEPROVINCIA SET ProvNombre = @provNombre WHERE (ProvCod = @provCod)';
              sqlGeneralNomExist = 'if not exists (SELECT ProvCod FROM TEPROVINCIA WHERE (ProvCod = @provCod)) INSERT INTO dbo.TEPROVINCIA (ProvCod,ProvNombre) VALUES (@provCod,@provNombre)';
              sqlValidacion = 'SELECT * FROM TEPROVINCIA';
            }
            if (peticionNameNom === 'ORGANISMO') {
              /* SQL ORGANISMO */

              sqlGeneralExist = 'if exists (SELECT OrganCodigo FROM TEORGANISMO WHERE (OrganCodigo = @organCodigo)) UPDATE dbo.TEORGANISMO SET OrganDescripcion = @organDescripcion,OrganActivo = @organActivo WHERE (OrganCodigo = @organCodigo)';
              sqlGeneralNomExist = 'if not exists (SELECT OrganCodigo FROM TEORGANISMO WHERE (OrganCodigo = @organCodigo)) INSERT INTO dbo.TEORGANISMO (OrganCodigo,OrganDescripcion,OrganEI,OrganUI,OrganFechaModif,OrganActivo) VALUES (@organCodigo,@organDescripcion,@organEI,@organUI,@organFechaModif,@organActivo)';
            }
            if (peticionNameNom === 'RELACION ORG - UNION') {
              /* SQL RELACION ORG - UNION */
              sqlGeneralExist = 'if exists (SELECT OrganCodigo,UnionCodigo FROM SMGUNION WHERE (OrganCodigo = @organCodigo) AND (UnionCodigo = @unionCodigo)) UPDATE dbo.SMGUNION SET UnionDescripcion = @unionDescripcion,UnionActivo = @unionActivo WHERE (OrganCodigo = @organCodigo) AND (UnionCodigo = @unionCodigo)';
              sqlGeneralNomExist = 'if not exists (SELECT OrganCodigo,UnionCodigo FROM SMGUNION WHERE (OrganCodigo = @organCodigo) AND (UnionCodigo = @unionCodigo)) INSERT INTO dbo.SMGUNION (OrganCodigo,UnionCodigo,UnionDescripcion,UnionUI,UnionFechaModif,UnionActivo) VALUES (@organCodigo,@unionCodigo,@unionDescripcion,@unionUI,@unionFechaModif,@unionActivo)';
            }
            if (peticionNameNom === 'REEUP') {
              /* SQL REEUP */
              sqlGeneralExist = 'SET ANSI_WARNINGS OFF if exists (SELECT ReeupCod FROM TEREEUP WHERE (ReeupCod = @reeupCod)) UPDATE dbo.TEREEUP SET ReeupNom = @reeupNom,ReeupActivo = @reeupActivo WHERE (ReeupCod = @reeupCod) SET ANSI_WARNINGS ON';
              sqlGeneralNomExist = 'SET ANSI_WARNINGS OFF if not exists (SELECT ReeupCod FROM TEREEUP WHERE (ReeupCod = @reeupCod)) INSERT INTO dbo.TEREEUP (ReeupCod,ReeupNom,ReeupDir,ReeupTelef,ReeupCAE,ReeupDPA,ReeupOrg,ReeupSub,ReeupNAE,ReeupSiglas,ReeupActivo) VALUES (@reeupCod,@reeupNom,@reeupDir,@reeupTelef,@reeupCAE,@reeupDPA,@reeupOrg,@reeupSub,@reeupNAE,@reeupSiglas,@reeupActivo) SET ANSI_WARNINGS ON';
            }
            if (peticionNameNom === 'PAISES') {
              sqlGeneralExist = 'SET ANSI_WARNINGS OFF if exists (SELECT PaisCodIntern FROM SCOPAIS WHERE (PaisCodIntern = @paisCodIntern)) UPDATE dbo.SCOPAIS SET PaisDescripcion =@paisDescripcion,PaisCiudadania=@paisCiudadania,PaisSiglas=@paisSiglas WHERE (PaisCodIntern=@paisCodIntern) SET ANSI_WARNINGS ON';
              sqlGeneralNomExist = 'SET ANSI_WARNINGS OFF if not exists (SELECT PaisCodIntern FROM SCOPAIS WHERE (PaisCodIntern= @paisCodIntern)) INSERT INTO dbo.SCOPAIS (PaisCodIntern,PaisDescripcion,PaisCiudadania,PaisSiglas,PaisSeleccionado) VALUES (@paisCodIntern,@paisDescripcion,@paisCiudadania,@paisSiglas,@paisSeleccionado) SET ANSI_WARNINGS ON';
            }
            if (peticionNameNom === 'MUNICIPIOS') {
              sqlGeneralExist = 'if exists (SELECT ProvCod,MunicCod FROM TEMUNICIPIOS WHERE (ProvCod = @provCod) AND (MunicCod =@municCod)) UPDATE dbo.TEMUNICIPIOS SET MunicNombre = @municNombre WHERE ((ProvCod = @provCod) AND (MunicCod = @municCod))';
              sqlGeneralNomExist = 'if not exists (SELECT ProvCod,MunicCod FROM TEMUNICIPIOS WHERE (ProvCod = @provCod) AND (MunicCod = @municCod)) INSERT INTO dbo.TEMUNICIPIOS (ProvCod,MunicCod,MunicNombre) VALUES (@provCod,@municCod,@municNombre)';
            }
            if (peticionNameNom === 'REPARTOS') {
              sqlGeneralExist = 'if exists (SELECT TRepartosCodigo,ProvCod,MunicCod  FROM TEREPARTOS WHERE (TRepartosCodigo = @tRepartosCodigo))' + 'UPDATE dbo.TEREPARTOS SET TRepartosNombre = @tRepartosNombre,ProvCod = @provCod,MunicCod = @municCod WHERE (TRepartosCodigo = @tRepartosCodigo)';
              sqlGeneralNomExist = 'if not exists (SELECT TRepartosCodigo,ProvCod,MunicCod FROM TEREPARTOS WHERE (TRepartosCodigo = @tRepartosCodigo))' + 'INSERT INTO dbo.TEREPARTOS (TRepartosCodigo,ProvCod,TRepartosNombre,MunicCod) VALUES (@tRepartosCodigo,@provCod,@tRepartosNombre,@municCod)';
            }
            if (peticionNameNom === 'NIT') {
             sqlGeneralExist = 'if exists (SELECT NITCodigo FROM SMGNIT WHERE (NITCodigo= @nITCodigo)) UPDATE dbo.SMGNIT SET NITDescrip = @nITDescrip,NITReeupCod = @nITReeupCod,NITSiglas = @nITSiglas,NITDirec = @nITDirec,NITDPA = @nITDPA,NAECOD = @nAECOD,NITSuborCod = @nITSuborCod';
              sqlGeneralNomExist = 'if not exists (SELECT NITCodigo FROM SMGNIT WHERE (NITCodigo = @nITCodigo)) INSERT INTO dbo.SMGNIT (NITCodigo,NITDescrip,NITReeupCod,NITSiglas,NITDirec,NITDPA,NAECOD,NITSuborCod) VALUES (@nITCodigo,@nITDescrip,@nITReeupCod,@nITSiglas,@nITDirec,@nITDPA,@nAECOD,@nITSuborCod)';
            }
            _context3.next = 17;
            return (0, _connection.getConnection)();
          case 17:
          
          //_context3.sent = new Connection(configdbAll);
            pool = _context3.sent;
           /*  console.log(configdbAll)
            console.log(pool) */
            
          //  console.log(pool)
            pool.connect(function (err) {
              if (err) {
                console.log('Connection Fallo');
                throw err;
              }
              executeStatement();
              // Deshabilitar triger
            });
            executeSQLIfExist = function executeSQLIfExist(nomName, j, sql, callback) {
             
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
                  rowCollectionOnRequestCompletion: true,
                  connectTimeout: 300000,
                  requestTimeout: 300000
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

                // Parametros Nom Provincia
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
                if (nomName === 'RELACION ORG - UNION') {
                  request.addParameter('organCodigo', TYPES.Int, j['OrganCodigo']);
                  request.addParameter('unionCodigo', TYPES.Int, j['UnionCodigo']);
                  request.addParameter('unionDescripcion', TYPES.VarChar, j['UnionDescripcion']);
                  request.addParameter('unionActivo', TYPES.Numeric, j['UnionActivo']);
                }
                if (nomName === 'REEUP') {
                  request.addParameter('reeupCod', TYPES.VarChar, j['ReeupCod']);
                  request.addParameter('reeupNom', TYPES.VarChar, j['ReeupNom']);
                  request.addParameter('reeupActivo', TYPES.Numeric, j['ReeupActivo']);
                }
                if (nomName === 'PAISES') {
                  request.addParameter('paisCodIntern', TYPES.VarChar, j['PaisCodIntern']);
                  request.addParameter('paisDescripcion', TYPES.VarChar, j['PaisDescripcion']);
                  request.addParameter('paisCiudadania', TYPES.VarChar, j['PaisCiudadania']);
                  request.addParameter('paisSiglas', TYPES.Char, j['PaisSiglas']);
                }
                if (nomName === 'MUNICIPIOS') {
                  request.addParameter('provCod', TYPES.SmallInt, j['ProvCod']);
                  request.addParameter('municCod', TYPES.SmallInt, j['MunicCod']);
                  request.addParameter('municNombre', TYPES.VarChar, j['MunicNombre']);
                }
                if (nomName === 'REPARTOS') {
                  request.addParameter('tRepartosCodigo', TYPES.SmallInt, j['TRepartosCodigo']);
                  request.addParameter('provCod', TYPES.SmallInt, j['ProvCod']);
                  request.addParameter('tRepartosNombre', TYPES.VarChar, j['TRepartosNombre']);
                  request.addParameter('municCod', TYPES.SmallInt, j['MunicCod']);
                }
                if (nomName === 'NIT') {
                  request.addParameter('nITCodigo', TYPES.VarChar, j['NITCodigo']);
                  request.addParameter('nITDescrip', TYPES.VarChar, j['NITDescrip']);
                  request.addParameter('nITReeupCod', TYPES.VarChar, j['NITReeupCod']);
                  request.addParameter('nITSiglas', TYPES.VarChar, j['NITSiglas']);
                  request.addParameter('nITDirec', TYPES.VarChar, j['NITDirec']);
                  request.addParameter('nITDPA', TYPES.Char, j['NITDPA']);
                  request.addParameter('nAECOD', TYPES.Int, j['NAECOD']);
                  request.addParameter('nITSuborCod', TYPES.SmallInt, j['NITSuborCod']);
                }
                connectionGeneral.execSql(request);
              });
            };
            executeSQLIfNotExist = function executeSQLIfNotExist(nomName, j, sql, callback) {
              //   console.log(sql);

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
                  rowCollectionOnRequestCompletion: true,
                  connectTimeout: 300000,
                  requestTimeout: 300000
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

                /* request.on("requestCompleted",function(){
                
                  
                }) */

                // PROVINCIAS
                if (nomName === 'PROV') {
                  request.addParameter('provCod', TYPES.Int, j['ProvCod']);
                  request.addParameter('provNombre', TYPES.VarChar, j['ProvNombre']);
                }
                // ORGANISMO
                if (nomName === 'ORGANISMO') {
                  request.addParameter('organCodigo', TYPES.Int, j['OrganCodigo']);
                  request.addParameter('organDescripcion', TYPES.VarChar, j['OrganDescripcion']);
                  request.addParameter('organEI', TYPES.SmallInt, j['OrganEI']);
                  request.addParameter('organUI', TYPES.SmallInt, j['OrganUI']);
                  request.addParameter('organFechaModif', TYPES.Date, j['OrganFechaModif']);
                  request.addParameter('organActivo', TYPES.Numeric, j['OrganActivo']);
                }
                // RELACION ORG - UNION
                if (nomName === 'RELACION ORG - UNION') {
                  //  console.log(j['UnionCodigo']);

                  request.addParameter('organCodigo', TYPES.Int, j['OrganCodigo']);
                  request.addParameter('unionCodigo', TYPES.Int, j['UnionCodigo']);
                  request.addParameter('unionDescripcion', TYPES.VarChar, j['UnionDescripcion']);
                  request.addParameter('unionUI', TYPES.SmallInt, j['UnionUI']);
                  request.addParameter('unionFechaModif', TYPES.DateTime, j['UnionFechaModif']);
                  request.addParameter('unionActivo', TYPES.Numeric, j['UnionActivo']);
                }
                if (nomName === 'REEUP') {
                  request.addParameter('reeupCod', TYPES.VarChar, j['ReeupCod']);
                  request.addParameter('reeupNom', TYPES.VarChar, j['ReeupNom']);
                  request.addParameter('reeupDir', TYPES.VarChar, j['ReeupDir']);
                  request.addParameter('reeupTelef', TYPES.VarChar, j['ReeupTelef']);
                  request.addParameter('reeupCAE', TYPES.VarChar, j['ReeupCAE']);
                  request.addParameter('reeupDPA', TYPES.Char, j['ReeupDPA']);
                  request.addParameter('reeupOrg', TYPES.VarChar, j['ReeupOrg']);
                  request.addParameter('reeupSub', TYPES.SmallInt, j['ReeupSub']);
                  request.addParameter('reeupNAE', TYPES.Int, j['ReeupNAE']);
                  request.addParameter('reeupSiglas', TYPES.VarChar, j['ReeupSiglas']);
                  request.addParameter('reeupActivo', TYPES.Numeric, j['ReeupActivo']);
                }
                if (nomName === 'PAISES') {
                  request.addParameter('paisCodIntern', TYPES.Numeric, j['PaisCodIntern']);
                  request.addParameter('paisDescripcion', TYPES.VarChar, j['PaisDescripcion']);
                  request.addParameter('paisCiudadania', TYPES.VarChar, j['PaisCiudadania']);
                  request.addParameter('paisSiglas', TYPES.Char, j['PaisSiglas']);
                  request.addParameter('paisSeleccionado', TYPES.Char, j['PaisSeleccionado']);
                  /*      request.addParameter('paisBandera', TYPES.VarBinary,j['PaisBandera'])
                  request.addParameter('paisBandera_GXI', TYPES.VarChar, j['PaisBandera_GXI'])
                  */
                }

                if (nomName === 'MUNICIPIOS') {
                  request.addParameter('provCod', TYPES.SmallInt, j['ProvCod']);
                  request.addParameter('municCod', TYPES.SmallInt, j['MunicCod']);
                  request.addParameter('municNombre', TYPES.VarChar, j['MunicNombre']);
                }
                if (nomName === 'REPARTOS') {
                  request.addParameter('tRepartosCodigo', TYPES.SmallInt, j['TRepartosCodigo']);
                  request.addParameter('provCod', TYPES.SmallInt, j['ProvCod']);
                  request.addParameter('tRepartosNombre', TYPES.VarChar, j['TRepartosNombre']);
                  request.addParameter('municCod', TYPES.SmallInt, j['MunicCod']);
                }
                if (nomName === 'NIT') {
                  request.addParameter('nITCodigo', TYPES.VarChar, j['NITCodigo']);
                  request.addParameter('nITDescrip', TYPES.VarChar, j['NITDescrip']);
                  request.addParameter('nITReeupCod', TYPES.VarChar, j['NITReeupCod']);
                  request.addParameter('nITSiglas', TYPES.VarChar, j['NITSiglas']);
                  request.addParameter('nITDirec', TYPES.VarChar, j['NITDirec']);
                  request.addParameter('nITDPA', TYPES.Char, j['NITDPA']);
                  request.addParameter('nAECOD', TYPES.Int, j['NAECOD']);
                  request.addParameter('nITSuborCod', TYPES.SmallInt, j['NITSuborCod']);
                }
                connectionGeneral.execSql(request);
              });
            };
            executeSQLHabilitarTrigger = function executeSQLHabilitarTrigger(sql, callback) {
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
                  rowCollectionOnRequestCompletion: true,
                  connectTimeout: 300000,
                  requestTimeout: 300000
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
            
          case 22:
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