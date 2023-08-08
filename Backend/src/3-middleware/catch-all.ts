import { NextFunction, Request, Response } from "express";
import logger from "../2-utils/logger";
import appConfig from "../2-utils/app-config";

function catchAll(err: any, request: Request, response: Response, next: NextFunction) {

    const status = err.status || 500;

    const isCrash = status >= 500 && status <= 599;

    // Log in console
    console.log(err);

    // Log in assets/logs
    logger.logError(err.message, err);

    // Crashed in production - send generic error message.
    const message = isCrash && appConfig.isProduction ? "An error occurred, please try again." : err.message;

    response.status(status).send(message);
}

export default catchAll;
