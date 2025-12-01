import cors from "cors";
import express, { Request, Response } from "express";
import { initialize } from "express-openapi";
import * as OpenApiValidator from "express-openapi-validator";

import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT ?? 3000;

const app = express();

const spec = path.join(__dirname, "openapi.yaml");

app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

// app.use('v1/api-docs', express.static(spec));

app.use(
  OpenApiValidator.middleware({
    apiSpec: spec
  })
);

await initialize({
  apiDoc: spec,
  app,
  paths: path.resolve(__dirname, "paths"),
  routesGlob: "**/*.{ts,js}",
  routesIndexFileRegExp: /(?:index)?\.[tj]s$/
});

app.use((err: Error, req: Request, res: Response) => {
  console.error(err);
  res.status(500).send(err);
});

app.listen(port, () => {
  console.log(`Server running on ${port.toString()}`);
});
