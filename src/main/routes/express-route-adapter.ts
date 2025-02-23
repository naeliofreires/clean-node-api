import { type Request, type Response } from "express";
import { type IController } from "../../presentation/protocols/controllers";
import {
  type HttpRequest,
  type HttpResponse,
} from "../../presentation/protocols/http";

export default function adapter(controller: IController) {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = { body: req.body };
    const httpResponse: HttpResponse = await controller.handle(httpRequest);

    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
}
