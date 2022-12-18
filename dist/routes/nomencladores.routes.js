"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _nomencladores = require("../controllers/nomencladores.controller");
var router = (0, _express.Router)();
router.get('/provincias', _nomencladores.getProvincias);
router.post('/importarnomenclador', _nomencladores.ImportarNomencladores);
var _default = router;
exports["default"] = _default;