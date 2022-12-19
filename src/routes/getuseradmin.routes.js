'use strict'

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"]=void 0;      
var _express = require('express');
var _config = _interopRequireDefault(require("../config"));
var _gestuseradmin= require('../controllers/gestuseradmin.controller')
var router = (0, _express.Router)();
router.post('/gestuseradmin',_gestuseradmin.parametros);
var _default = router;
exports["default"] = _default;