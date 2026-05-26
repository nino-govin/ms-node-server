/* jshint esversion: 11 */
import express from 'express';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {routing} from "./routes/_.js";
import {update} from "./netTools/middleware.js";
/* global console, process */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const packageJSON = require("./package.json");
const rootDir = 'dist';

const app = express();
const jsonParser = bodyParser.json({
    limit: '50mb'
});

const configureExpress = function () { return new Promise((resolve, reject) => {

    app.disable('x-powered-by');
    app.use(express.static(rootDir));
    app.set('views', path.join(rootDir, 'views'));
    app.set('view engine', 'pug');
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true}));

    return resolve();
}); };

const configureRouting = function () { return new Promise((resolve, reject) => {

    app.get('/*', update);
    app.delete('/*', update);
    app.post('/*', jsonParser, update);

    routing(app, jsonParser);

    return resolve();
}); };

const launch = function () { return new Promise((resolve, reject) => {

    const port = 8081;
    const server_http = http.createServer(app);
    server_http.listen(port, (err) => {
        if (err) {
            return reject(err);
        }
        return resolve();
    });
}); };

configureExpress()
    .then(configureRouting)
    .then(launch)
    .then(() => {
        console.log('\x1b[4m' + packageJSON.name + '\x1b[0m started.');
        console.log('______________________________________________________________________');
    }).catch((err) => {
    console.error(err);
    process.exit(1);
});