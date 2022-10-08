import { Response, Request } from "express";
import moment from "moment";
import { CallbackError, Mongoose } from "mongoose";
const mongoose = require("mongoose");
import { nanoid } from "nanoid";

// Modelo
import sucursalModel from "../models/sucursalModel";

// Interfaces
import { SucursalModel } from "../interfaces/sucursal";

// socket
import Server from "./server";

export class Sucursal {
  public idRef: string;
  public readonly sucursalIDs = `sucursalIDs.json`;

  constructor() {
    this.idRef = nanoid(10);
  }

  // Crear sucursal
  nuevaSucursal(req: any, resp: Response): void {
    const idCreador: any = new mongoose.Types.ObjectId(req.usuario._id);
    const estado: boolean = req.body.estado;
    const nombre: string = req.body.nombre;
    const telefono: string = req.body.telefono;
    const provincia: any = req.body.provincia;
    const direccion: string = req.body.direccion;
    const fecha: string = moment().format("DD-MM-YYYY");

    const nuevaSucursal = new sucursalModel({
      idCreador: idCreador,
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
        return resp.json({
          ok: false,
          mensaje: `No se pudo crear la Sucursal`,
          err,
        });
      } else {
        const server = Server.instance;
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
  async obtenerSucs(req: any, resp: Response): Promise<any> {
    const respSuc = await sucursalModel.aggregate([
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
    } else {
      return resp.json({
        ok: false,
        mensaje: "Error al obtener sucursales",
      });
    }
  }

  // Editar sucursal
  editarSucursal(req: any, resp: Response): void {
    const id: string = req.body.id;
    const estado: boolean = req.body.estado;
    const nombre: string = req.body.nombre;
    const telefono: string = req.body.telefono;
    const provincia: any = req.body.provincia;
    const direccion: string = req.body.direccion;

    // console.log(estado);

    const query = {
      nombre,
      telefono,
      direccion,
      provincia,
      estado,
    };

    sucursalModel.findById(
      id,
      (err: CallbackError, sucursalDB: SucursalModel) => {
        if (err) {
          return resp.json({
            ok: false,
            mensaje: `Error interno`,
            err,
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

        sucursalModel.findByIdAndUpdate(
          id,
          query,
          { new: true },
          (err: CallbackError, sucursalDB: any) => {
            if (err) {
              return resp.json({
                ok: false,
                mensaje: `No se pudo editar la Sucursal`,
                err,
              });
            }

            if (!sucursalDB) {
              return resp.json({
                ok: false,
                mensaje: `No existe la sucursal que quiere Editar`,
                err,
              });
            }
            const server = Server.instance;
            server.io.emit("cargar-sucursales", {
              ok: true,
            });
            return resp.json({
              ok: true,
              mensaje: `Sucursal actualizada`,
              sucursalDB,
            });
          }
        );
      }
    );
  }

  // Eliminar una sucursal
  eliminarSucursal(req: Request, resp: Response): any {
    const id = req.get("id");
    sucursalModel.findByIdAndDelete(
      id,
      {},
      (err: CallbackError, sucursalDB) => {
        if (err) {
          return resp.json({
            ok: false,
            mensaje: `Error al eliminar sucursal o no existe`,
            err,
          });
        } else {
          const server = Server.instance;
          server.io.emit("cargar-sucursales", {
            ok: true,
          });
          return resp.json({
            ok: true,
            mensaje: `Sucursal eliminada`,
            sucursalDB,
          });
        }
      }
    );
  }
}
