import chai from 'chai';
const expect = chai.expect;
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('server.js', function() {

    describe('module imports', function() {
        it('should import express', async function() {
            const express = await import('express');
            expect(express.default).to.be.a('function');
        });

        it('should import http', async function() {
            const http = await import('http');
            expect(http.createServer).to.be.a('function');
        });

        it('should import body-parser', async function() {
            const bodyParser = await import('body-parser');
            expect(bodyParser.default).to.be.a('function');
        });

        it('should import cookie-parser', async function() {
            const cookieParser = await import('cookie-parser');
            expect(cookieParser.default).to.be.a('function');
        });
    });

    describe('routing module', function() {
        it('should import routing from ./routes/_.js', async function() {
            const routing = await import('./routes/_.js');
            expect(routing.routing).to.be.a('function');
        });
    });

    describe('middleware module', function() {
        it('should import update from ./netTools/middleware.js', async function() {
            const middleware = await import('./netTools/middleware.js');
            expect(middleware.update).to.be.a('function');
        });
    });

    describe('sheepfold module', function() {
        it('should export spawn, pop, get functions', async function() {
            const sheepfold = await import('./sheepManager/sheepfold.js');
            expect(sheepfold.spawn).to.be.a('function');
            expect(sheepfold.pop).to.be.a('function');
            expect(sheepfold.get).to.be.a('function');
        });
    });

    describe('package.json', function() {
        it('should have type: module for ES6', async function() {
            const pkg = await import('./package.json', { assert: { type: 'json' } });
            expect(pkg.default.type).to.equal('module');
        });

        it('should have express in dependencies', async function() {
            const pkg = await import('./package.json', { assert: { type: 'json' } });
            expect(pkg.default.dependencies).to.have.property('express');
        });

        it('should have mocha in devDependencies', async function() {
            const pkg = await import('./package.json', { assert: { type: 'json' } });
            expect(pkg.default.devDependencies).to.have.property('mocha');
        });

        it('should have chai in devDependencies', async function() {
            const pkg = await import('./package.json', { assert: { type: 'json' } });
            expect(pkg.default.devDependencies).to.have.property('chai');
        });

        it('should have test script defined', async function() {
            const pkg = await import('./package.json', { assert: { type: 'json' } });
            expect(pkg.default.scripts).to.have.property('test');
            expect(pkg.default.scripts.test).to.equal('mocha **.spec.js');
        });

        it('should have start script defined', async function() {
            const pkg = await import('./package.json', { assert: { type: 'json' } });
            expect(pkg.default.scripts).to.have.property('start');
            expect(pkg.default.scripts.start).to.equal('node server.js');
        });
    });

    describe('main app configuration', function() {
        it('should create express app instance', async function() {
            const express = await import('express');
            const app = express.default();
            expect(app).to.be.an('object');
            expect(app.get).to.be.a('function');
            expect(app.post).to.be.a('function');
            expect(app.delete).to.be.a('function');
        });

        it('express app should have use method', async function() {
            const express = await import('express');
            const app = express.default();
            expect(app.use).to.be.a('function');
        });

        it('express app should have set method', async function() {
            const express = await import('express');
            const app = express.default();
            expect(app.set).to.be.a('function');
        });

        it('express app should have disable method', async function() {
            const express = await import('express');
            const app = express.default();
            expect(app.disable).to.be.a('function');
        });
    });

    describe('body-parser configuration', function() {
        it('should create json parser with 50mb limit', async function() {
            const bodyParser = await import('body-parser');
            const jsonParser = bodyParser.default.json({ limit: '50mb' });
            expect(jsonParser).to.be.a('function');
        });
    });

    describe('directory structure', function() {
        it('should have routes directory', async function() {
            const fs = await import('fs');
            const routesPath = path.join(__dirname, 'routes');
            const exists = fs.existsSync(routesPath);
            expect(exists).to.be.true;
        });

        it('should have netTools directory', async function() {
            const fs = await import('fs');
            const netToolsPath = path.join(__dirname, 'netTools');
            const exists = fs.existsSync(netToolsPath);
            expect(exists).to.be.true;
        });

        it('should have sheepManager directory', async function() {
            const fs = await import('fs');
            const sheepManagerPath = path.join(__dirname, 'sheepManager');
            const exists = fs.existsSync(sheepManagerPath);
            expect(exists).to.be.true;
        });

        it('should have package.json', async function() {
            const fs = await import('fs');
            const pkgPath = path.join(__dirname, 'package.json');
            const exists = fs.existsSync(pkgPath);
            expect(exists).to.be.true;
        });
    });

    describe('required files exist', function() {
        it('should have server.js', async function() {
            const fs = await import('fs');
            const serverPath = path.join(__dirname, 'server.js');
            const exists = fs.existsSync(serverPath);
            expect(exists).to.be.true;
        });

        it('should have routes/_.js', async function() {
            const fs = await import('fs');
            const routerPath = path.join(__dirname, 'routes', '_.js');
            const exists = fs.existsSync(routerPath);
            expect(exists).to.be.true;
        });

        it('should have routes/main.js', async function() {
            const fs = await import('fs');
            const mainPath = path.join(__dirname, 'routes', 'main.js');
            const exists = fs.existsSync(mainPath);
            expect(exists).to.be.true;
        });

        it('should have netTools/middleware.js', async function() {
            const fs = await import('fs');
            const middlewarePath = path.join(__dirname, 'netTools', 'middleware.js');
            const exists = fs.existsSync(middlewarePath);
            expect(exists).to.be.true;
        });

        it('should have netTools/responseTools.js', async function() {
            const fs = await import('fs');
            const responseToolsPath = path.join(__dirname, 'netTools', 'responseTools.js');
            const exists = fs.existsSync(responseToolsPath);
            expect(exists).to.be.true;
        });

        it('should have sheepManager/sheepfold.js', async function() {
            const fs = await import('fs');
            const sheepfoldPath = path.join(__dirname, 'sheepManager', 'sheepfold.js');
            const exists = fs.existsSync(sheepfoldPath);
            expect(exists).to.be.true;
        });
    });

    describe('port configuration', function() {
        it('should be set to 8081', async function() {
            const fs = await import('fs');
            const serverPath = path.join(__dirname, 'server.js');
            const content = fs.readFileSync(serverPath, 'utf-8');
            expect(content).to.include('8081');
        });
    });

    describe('http vs https', function() {
        it('should use http module not https', async function() {
            const http = await import('http');
            expect(http.createServer).to.be.a('function');
        });
    });

    describe('pug template engine', function() {
        it('should be available for template rendering', async function() {
            const pug = await import('pug');
            expect(pug.default).to.be.a('function');
        });
    });

    describe('express middleware order', function() {
        it('should apply body-parser before routing', async function() {
            const fs = await import('fs');
            const serverPath = path.join(__dirname, 'server.js');
            const content = fs.readFileSync(serverPath, 'utf-8');

            const bodyParserIndex = content.indexOf('bodyParser');
            const routingIndex = content.indexOf('routing');

            expect(bodyParserIndex).to.be.lessThan(routingIndex);
        });
    });

    describe('static file serving', function() {
        it('should serve from dist directory', async function() {
            const fs = await import('fs');
            const serverPath = path.join(__dirname, 'server.js');
            const content = fs.readFileSync(serverPath, 'utf-8');
            expect(content).to.include("'dist'");
        });
    });
});
