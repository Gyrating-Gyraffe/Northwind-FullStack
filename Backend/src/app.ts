require("dotenv").config(); // Load .env file into process.env
import express from "express";
import cors from "cors";
import appConfig from "./2-utils/app-config";
import catchAll from "./3-middleware/catch-all";
import routeNotFound from "./3-middleware/route-not-found";
import authController from "./6-controllers/auth-controller";
import productsController from "./6-controllers/products-controller";
import forumController from "./6-controllers/forum-controller";
import sanitize from "./3-middleware/sanitize";
import expressRateLimit from "express-rate-limit";

const server = express();

// Rate limit: 
server.use(expressRateLimit({
    windowMs: 1000, // Time window in milliseconds
    max: 10 // Limit each IP to 10 requests per windowMs
}));

server.use(cors({ origin: appConfig.corsOrigin }));
server.use(express.json());

// Strip tags from request body
server.use(sanitize);

server.use("/api", authController);
server.use("/api", productsController);
server.use("/api", forumController);
server.use("*", routeNotFound);
server.use(catchAll);

server.listen(appConfig.port, () => console.log(`Listening on http://localhost:${appConfig.port}`));

