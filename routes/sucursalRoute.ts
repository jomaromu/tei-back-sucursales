import { Router, Request, Response } from "express";
import { verificaToken } from "../auth/auth";
import { Sucursal } from "../class/sucursalClass";

// instanciar el Router
const sucursalRouter = Router();

// ==================================================================== //
// Crear una sucursal
// ==================================================================== //
sucursalRouter.post(
  "/nuevaSucursal",
  [verificaToken],
  (req: Request, resp: Response) => {
    const nuevaSucursal = new Sucursal();
    nuevaSucursal.nuevaSucursal(req, resp);
  }
);

// ==================================================================== //
// Editar una sucursal
// ==================================================================== //
sucursalRouter.put(
  "/editarSucursal",
  [verificaToken],
  (req: Request, resp: Response) => {
    const editarSucursal = new Sucursal();
    editarSucursal.editarSucursal(req, resp);
  }
);

// ==================================================================== //
// Obtener todas las sucursales
// ==================================================================== //
sucursalRouter.get(
  "/obtenerSucs",
  [verificaToken],
  (req: Request, resp: Response) => {
    const obtenerSucs = new Sucursal();
    obtenerSucs.obtenerSucs(req, resp);
  }
);

// ==================================================================== //
// Eliminar una sucursal
// ==================================================================== //
sucursalRouter.delete(
  "/eliminarSucursal",
  [verificaToken],
  (req: Request, resp: Response) => {
    const eliminarSucursal = new Sucursal();
    eliminarSucursal.eliminarSucursal(req, resp);
  }
);

export default sucursalRouter;
