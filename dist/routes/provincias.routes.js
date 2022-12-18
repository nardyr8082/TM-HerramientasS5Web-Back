"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _provincias = require("../controllers/provincias.controller");
var router = (0, _express.Router)();
router.get('/provincias', _provincias.getProvincias);
router.post('/importarnomenclador', _provincias.ImportarNomencladores);
var _default = router;
exports["default"] = _default;