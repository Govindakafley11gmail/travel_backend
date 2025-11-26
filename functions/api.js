import app from "../dist/server";
import { handle } from "hono/node";

export const onRequest = handle(app);
