"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../auth/auth");
const sucursalClass_1 = require("../class/sucursalClass");
// instanciar el Router
const sucursalRouter = (0, express_1.Router)();
// ==================================================================== //
// Crear una sucursal
// ==================================================================== //
sucursalRouter.post("/nuevaSucursal", [auth_1.verificaToken], (req, resp) => {
    const nuevaSucursal = new sucursalClass_1.Sucursal();
    nuevaSucursal.nuevaSucursal(req, resp);
});
// ==================================================================== //
// Editar una sucursal
// ==================================================================== //
sucursalRouter.put("/editarSucursal", [auth_1.verificaToken], (req, resp) => {
    const editarSucursal = new sucursalClass_1.Sucursal();
    editarSucursal.editarSucursal(req, resp);
});
// ==================================================================== //
// Obtener todas las sucursales
// ==================================================================== //
sucursalRouter.get("/obtenerSucs", [auth_1.verificaToken], (req, resp) => {
    const obtenerSucs = new sucursalClass_1.Sucursal();
    obtenerSucs.obtenerSucs(req, resp);
});
// ==================================================================== //
// Eliminar una sucursal
// ==================================================================== //
sucursalRouter.delete("/eliminarSucursal", [auth_1.verificaToken], (req, resp) => {
    const eliminarSucursal = new sucursalClass_1.Sucursal();
    eliminarSucursal.eliminarSucursal(req, resp);
});
exports.default = sucursalRouter;
