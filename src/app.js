"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _config = _interopRequireDefault(require("./config"));
var _parametrosFrontBD = _interopRequireDefault(require("./routes/parametrosFrontBD.routes"));
var _nomencladores = _interopRequireDefault(require("./routes/nomencladores.routes"));
// Configuracion basica del servidor

//Rutas

var app = (0, _express["default"])();
var cors = require('cors');

// Configuraciones
app.set('port', _config["default"].port);

// MIDDLE WARES: configura el servidor para q resiva formatos json
app.use(_express["default"].json({
  limit: "200mb"
}));
app.use(_express["default"].urlencoded({
  extended: false,
  limit: "200mb"
}));
app.use(cors());
app.use(_parametrosFrontBD["default"]);
app.use(_nomencladores["default"]);
var _default = app;
exports["default"] = _default;