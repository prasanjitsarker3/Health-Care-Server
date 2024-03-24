import { Request, Response } from "express";
import { userService } from "./user.service";

const createdAdmin = async (req: Request, res: Response) => {
  const result = await userService.createdAdmin(req.body);
  res.send(result);
};

export const userController = {
  createdAdmin,
};
