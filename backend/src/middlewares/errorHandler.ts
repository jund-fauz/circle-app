import { Request, Response } from "express";

export function errorHandler(error: any, req: Request, res: Response, next: any) {
    res.status(error.status || 500).json({ code: error.status || 500, status: "error", message: error.message })
}