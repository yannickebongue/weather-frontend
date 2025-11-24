import express from 'express';
import axios from 'axios';
import https from 'node:https';
import { initialize } from 'express-openapi';

import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';

import cors from 'cors';

import * as OpenApiValidator from 'express-openapi-validator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;

const app = new express();

const spec = path.join(__dirname, "openapi.yaml");

app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

// app.use('v1/api-docs', express.static(spec));

app.use(OpenApiValidator.middleware({
    apiSpec: spec
}));

initialize({
	app,
	apiDoc: spec,
    dependencies: {
        axios: axios,
        https: https
    },
	paths: path.resolve(__dirname, "paths")
});

app.use(function(err, req, res, next) {
    console.error(err);
	res.status(err.status || 500).json(err);
});

app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`);
});
