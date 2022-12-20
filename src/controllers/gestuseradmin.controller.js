var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')
const { request } = require('express')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.parametros = void 0
var _tedious = _interopRequireDefault(require('tedious'))
var _nodeLocalstorage = require('node-localstorage')
// Aqui se resiven los parametros de conexion para la BD que vienen del fronted

var Connection = require('tedious').Connection
var Request = require('tedious').Request

var parametros = function parametros (req, res) {
  if (req) {
    //console.log(req.body['configDB'])
    const operacion = req.body['operacionSelected']
    const configDB = req.body['configDB']
    var dbSettings = {
      server: configDB['server'],
      authentication: {
        type: 'default',
        options: {
          userName: configDB['userName'],
          password: configDB['password'],
          instanceName: configDB['instanceName'],
          port: 1433
        }
      },
      options: {
        database: configDB['database'],
        encrypt: false,
        tdsVersion: '7_3_B',
        rowCollectionOnRequestCompletion: true,
        connectTimeout: 300000,
        requestTimeout: 300000
      }
    }
    var connection = new Connection(dbSettings)
    connection.on('connect', function (err) {
      if (err) {
        throw err
      }
        desHabilitarTriggerGeneral()
      
    })

    connection.connect()

    function desHabilitarTriggerGeneral () {
      var requestDesTrigg = new Request(
        "if exists(SELECT name FROM sys.triggers WHERE (name = N'SMA_Event') AND (parent_class_desc = N'DATABASE')) disable TRIGGER SMA_Event ON DATABASE",
        function (err, rowCount) {
          if (err) {
            res.json(`Error al deshabilitar trigger: ${err}`)
          } else {
            connection.close()
            desHabilitarTriggerUsuario(
              'ALTER TABLE "SMAUSUARIOS" disable TRIGGER ALL',
              function (err) {
                if (err)
                  res.json(`Error DesHabilitar trigger SMAUSUARIO: ${err}`)
              }
            )
            if (operacion === 'admin') {
              admin(
                "UPDATE SMAUSUARIOS SET UsuarClave = 'LFáÚT;:4RjYVIm+.A.lú63iÑmHTUIk+.' WHERE (UsuarAdmin = '+OA+bNkr2oMR+qK6b+dlVA==') OR (UsuarAdmin = 'CZJ+9iF54+8rgRrKScF/wA==')",
                function (err, data) {
                  if (err)
                    res.json(
                      `Error al actualizar la contraseña del usuario admin.:${err}`
                    )
                  if (data)
                    res.json('Actualizada clave admin correctamente a: siscont5')
                }
              )
            }
            if (operacion === 'desbloquear') {
              desbloquear('UPDATE SMAUSUARIOS SET UsuarLog = 0 WHERE (UsuarLog = 1)', function (err, data) {
                if (err)
                  res.json(`Error al desbloquear usuarios bloqueados. :${err}`)
                if (data) res.json('Desbloqueado usuarios bloqueados correctamente')
              })
            }

            habilitarTriggerUsuario(
              'ALTER TABLE "SMAUSUARIOS" enable TRIGGER ALL',
              function (err) {
                if (err) {
                  res.json(`Error al habilitar trigger SMAUSUARIOS.:${err}`)
                } else {
                  habilitarTriggerGeneral(
                    "if exists (SELECT name FROM sys.triggers WHERE (name = N'SMA_Event') AND (parent_class_desc = N'DATABASE')) enable TRIGGER SMA_Event ON DATABASE",
                    function (err) {
                      if (err)
                        res.json(`Error al habilitar trigger general.:${err}`)
                    }
                  )
                }
              }
            )
          }
        }
      )
      connection.execSql(requestDesTrigg)
    }

    //Funciones llamadas
    const desHabilitarTriggerUsuario = function desHabilitarTriggerUsuario (
      sql,
      callback
    ) {
      var connectionGeneral = new Connection({
        server: configDB['server'],
        authentication: {
          type: 'default',
          options: {
            userName: configDB['userName'],
            password: configDB['password'],
            instanceName: configDB['instanceName'],
            port: 1433
          }
        },
        options: {
          database: configDB['database'],
          encrypt: false,
          tdsVersion: '7_3_B',
          rowCollectionOnRequestCompletion: true,
          connectTimeout: 300000,
          requestTimeout: 300000
        }
      })
      connectionGeneral.connect(function (err) {
        if (err) return callback(err, null)
        var request = new Request(sql, function (err, rowCount, rows) {
          connectionGeneral.close()
          if (err) return callback(err, null)
          callback(null, {
            rowCount: rowCount,
            rows: rows
          })
        })
        connectionGeneral.execSql(request)
      })
    }

    const admin = function admin (sql, callback) {
      var connectionGeneral = new Connection({
        server: configDB['server'],
        authentication: {
          type: 'default',
          options: {
            userName: configDB['userName'],
            password: configDB['password'],
            instanceName: configDB['instanceName'],
            port: 1433
          }
        },
        options: {
          database: configDB['database'],
          encrypt: false,
          tdsVersion: '7_3_B',
          rowCollectionOnRequestCompletion: true,
          connectTimeout: 300000,
          requestTimeout: 300000
        }
      })
      connectionGeneral.connect(function (err) {
        if (err) return callback(err, null)
        var request = new Request(sql, function (err, rowCount, rows) {
          connectionGeneral.close()
          if (err) return callback(err, null)
          callback(null, {
            rowCount: rowCount,
            rows: rows
          })
        })
        connectionGeneral.execSql(request)
      })
    }

    const desbloquear = function desbloquear (sql, callback) {
      var connectionGeneral = new Connection({
        server: configDB['server'],
        authentication: {
          type: 'default',
          options: {
            userName: configDB['userName'],
            password: configDB['password'],
            instanceName: configDB['instanceName'],
            port: 1433
          }
        },
        options: {
          database: configDB['database'],
          encrypt: false,
          tdsVersion: '7_3_B',
          rowCollectionOnRequestCompletion: true,
          connectTimeout: 300000,
          requestTimeout: 300000
        }
      })
      connectionGeneral.connect(function (err) {
        if (err) return callback(err, null)
        var request = new Request(sql, function (err, rowCount, rows) {
          connectionGeneral.close()
          if (err) return callback(err, null)
          callback(null, {
            rowCount: rowCount,
            rows: rows
          })
        })
        connectionGeneral.execSql(request)
      })
    }

    const habilitarTriggerUsuario = function habilitarTriggerUsuario (
      sql,
      callback
    ) {
      var connectionGeneral = new Connection({
        server: configDB['server'],
        authentication: {
          type: 'default',
          options: {
            userName: configDB['userName'],
            password: configDB['password'],
            instanceName: configDB['instanceName'],
            port: 1433
          }
        },
        options: {
          database: configDB['database'],
          encrypt: false,
          tdsVersion: '7_3_B',
          rowCollectionOnRequestCompletion: true,
          connectTimeout: 300000,
          requestTimeout: 300000
        }
      })
      connectionGeneral.connect(function (err) {
        if (err) return callback(err, null)
        var request = new Request(sql, function (err, rowCount, rows) {
          connectionGeneral.close()
          if (err) return callback(err, null)
          callback(null, {
            rowCount: rowCount,
            rows: rows
          })
        })
        connectionGeneral.execSql(request)
      })
    }
    const habilitarTriggerGeneral = function habilitarTriggerGeneral (
      sql,
      callback
    ) {
      var connectionGeneral = new Connection({
        server: configDB['server'],
        authentication: {
          type: 'default',
          options: {
            userName: configDB['userName'],
            password: configDB['password'],
            instanceName: configDB['instanceName'],
            port: 1433
          }
        },
        options: {
          database: configDB['database'],
          encrypt: false,
          tdsVersion: '7_3_B',
          rowCollectionOnRequestCompletion: true,
          connectTimeout: 300000,
          requestTimeout: 300000
        }
      })
      connectionGeneral.connect(function (err) {
        if (err) return callback(err, null)
        var request = new Request(sql, function (err, rowCount, rows) {
          connectionGeneral.close()
          if (err) return callback(err, null)
          callback(null, {
            rowCount: rowCount,
            rows: rows
          })
        })
        connectionGeneral.execSql(request)
      })
    }
  }
}
exports.parametros = parametros
