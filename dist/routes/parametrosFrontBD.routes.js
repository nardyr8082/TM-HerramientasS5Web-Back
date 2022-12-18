"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _parametrosFrontBD = require("../controllers/parametrosFrontBD.controller");
var _config = _interopRequireDefault(require("../config"));
var router = (0, _express.Router)();
router.post('/loginparambasedatos', _parametrosFrontBD.Parametros);
var _default = router;
exports["default"] = _default;