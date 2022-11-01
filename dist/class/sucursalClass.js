"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sucursal = void 0;
const moment_1 = __importDefault(require("moment"));
const mongoose = require("mongoose");
const nanoid_1 = require("nanoid");
// Modelo
const sucursalModel_1 = __importDefault(require("../models/sucursalModel"));
// socket
const server_1 = __importDefault(require("./server"));
class Sucursal {
    constructor() {
        this.sucursalIDs = `sucursalIDs.json`;
        this.idRef = (0, nanoid_1.nanoid)(10);
    }
    // Crear sucursal
    nuevaSucursal(req, resp) {
        const idCreador = new mongoose.Types.ObjectId(req.usuario._id);
        const foranea = new mongoose.Types.ObjectId(req.body.foranea);
        const estado = req.body.estado;
        const nombre = req.body.nombre;
        const telefono = req.body.telefono;
        const provincia = req.body.provincia;
        const direccion = req.body.direccion;
        const fecha = (0, moment_1.default)().format("DD/MM/YYYY");
        const objError = {
            mensaje: "",
        };
        const nuevaSucursal = new sucursalModel_1.default({
            idCreador,
            foranea,
            nombre,
            telefono,
            direccion,
            provincia,
            fecha_creacion: fecha,
            estado,
        });
        // guardar la sucursal
        nuevaSucursal.save((err, sucursalDB) => {
            if (err) {
                objError.mensaje = err === null || err === void 0 ? void 0 : err.message;
                return resp.json({
                    ok: false,
                    mensaje: `No se pudo crear la Sucursal`,
                    err: objError,
                });
            }
            else {
                const server = server_1.default.instance;
                server.io.emit("cargar-sucursales", {
                    ok: true,
                });
                return resp.json({
                    ok: true,
                    mensaje: `Sucursal creada`,
                    sucursalDB,
                });
            }
        });
    }
    // Obtener todas las sucursales
    obtenerSucs(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const foranea = mongoose.Types.ObjectId(req.get("foranea"));
            const respSuc = yield sucursalModel_1.default.aggregate([
                {
                    $match: { foranea },
                },
                {
                    $lookup: {
                        from: "userworkers",
                        localField: "idCreador",
                        foreignField: "_id",
                        as: "Usuario",
                    },
                },
            ]);
            if (respSuc) {
                return resp.json({
                    ok: true,
                    sucursalesDB: respSuc,
                });
            }
            else {
                return resp.json({
                    ok: false,
                    mensaje: "Error al obtener sucursales",
                    err: "Error al obtener sucursales",
                });
            }
        });
    }
    // Editar sucursal
    editarSucursal(req, resp) {
        const _id = new mongoose.Types.ObjectId(req.body.id);
        const foranea = new mongoose.Types.ObjectId(req.body.foranea);
        const estado = req.body.estado;
        const nombre = req.body.nombre;
        const telefono = req.body.telefono;
        const provincia = req.body.provincia;
        const direccion = req.body.direccion;
        const objError = {
            mensaje: "",
        };
        const query = {
            nombre,
            telefono,
            direccion,
            provincia,
            estado,
        };
        sucursalModel_1.default.findOne({ $and: [{ _id }, { foranea }] }, (err, sucursalDB) => {
            if (err) {
                objError.mensaje = err.message;
                return resp.json({
                    ok: false,
                    mensaje: `Error interno`,
                    err: objError,
                });
            }
            if (!sucursalDB) {
                return resp.json({
                    ok: false,
                    mensaje: `No se encontró una sucursal con ese ID en la base de datos`,
                });
            }
            if (!query.nombre) {
                query.nombre = sucursalDB.nombre;
            }
            if (!query.telefono) {
                query.telefono = sucursalDB.telefono;
            }
            if (!query.provincia) {
                query.provincia = sucursalDB.provincia;
            }
            if (!query.direccion) {
                query.direccion = sucursalDB.direccion;
            }
            if (query.estado === undefined || query.estado === null) {
                query.estado = sucursalDB.estado;
            }
            sucursalModel_1.default.updateOne({ $and: [{ _id }, { foranea }] }, query, { new: true }, (err, sucursalDB) => {
                if (err) {
                    objError.mensaje = err.message;
                    return resp.json({
                        ok: false,
                        mensaje: `No se pudo editar la Sucursal`,
                        err: objError.mensaje,
                    });
                }
                else {
                    const server = server_1.default.instance;
                    server.io.emit("cargar-sucursales", {
                        ok: true,
                    });
                    return resp.json({
                        ok: true,
                        mensaje: `Sucursal actualizada`,
                        sucursalDB,
                    });
                }
            });
        });
    }
    // Eliminar una sucursal
    eliminarSucursal(req, resp) {
        const _id = new mongoose.Types.ObjectId(req.get("id"));
        const foranea = new mongoose.Types.ObjectId(req.get("foranea"));
        const objError = {
            mensaje: "",
        };
        sucursalModel_1.default.findOneAndDelete({ $and: [{ _id }, { foranea }] }, {}, (err, sucursalDB) => {
            if (err) {
                objError.mensaje = err.message;
                return resp.json({
                    ok: false,
                    mensaje: `Error al eliminar sucursal o no existe`,
                    err: objError.mensaje,
                });
            }
            else {
                const server = server_1.default.instance;
                server.io.emit("cargar-sucursales", {
                    ok: true,
                });
                return resp.json({
                    ok: true,
                    mensaje: `Sucursal eliminada`,
                    sucursalDB,
                });
            }
        });
    }
}
exports.Sucursal = Sucursal;
