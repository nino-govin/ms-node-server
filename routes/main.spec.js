import chai from 'chai';
const expect = chai.expect;
import main from './main.js';
import { spawn as sheepSpawn, pop as sheepPop, get as sheepGet } from '../sheepManager/sheepfold.js';

// Mock Express app
function createMockApp() {
    const routes = {};

    return {
        routes: routes,
        get: function(path, handler) {
            if (!routes.get) {
                routes.get = {};
            }
            routes.get[path] = handler;
        },
        post: function(path, handler) {
            if (!routes.post) {
                routes.post = {};
            }
            routes.post[path] = handler;
        },
        delete: function(path, handler) {
            if (!routes.delete) {
                routes.delete = {};
            }
            routes.delete[path] = handler;
        }
    };
}

function createMockRes() {
    return {
        headersSent: false,
        statusCode: null,
        jsonData: null,
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        json: function(data) {
            this.jsonData = data;
            return this;
        },
        _200: function(msg, obj) {
            this.statusCode = 200;
            this.jsonData = {
                status: 200,
                message: msg ? 'Ok: ' + msg : 'Ok.',
                obj: obj || {},
                err: null
            };
            return this;
        }
    };
}

function createMockReq() {
    return {
        query: {},
        params: {},
        body: {}
    };
}

describe('routes/main', function() {

    beforeEach(function() {
        // Reset sheep counter
        while (sheepGet() > 0) {
            sheepPop();
        }
        while (sheepGet() < 0) {
            sheepSpawn();
        }
    });

    describe('route registration', function() {
        it('should register GET / route', function() {
            const app = createMockApp();
            main(app);

            expect(app.routes.get).to.have.property('/');
            expect(app.routes.get['/']).to.be.a('function');
        });

        it('should register GET /spawn route', function() {
            const app = createMockApp();
            main(app);

            expect(app.routes.get).to.have.property('/spawn');
            expect(app.routes.get['/spawn']).to.be.a('function');
        });

        it('should register GET /pop route', function() {
            const app = createMockApp();
            main(app);

            expect(app.routes.get).to.have.property('/pop');
            expect(app.routes.get['/pop']).to.be.a('function');
        });

        it('should register GET /get route', function() {
            const app = createMockApp();
            main(app);

            expect(app.routes.get).to.have.property('/get');
            expect(app.routes.get['/get']).to.be.a('function');
        });
    });

    describe('GET /', function() {
        it('should return welcome message', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/'];

            const req = createMockReq();
            const res = createMockRes();
            handler(req, res);

            expect(res.statusCode).to.equal(200);
            expect(res.jsonData.message).to.equal('Ok: Welcome !');
        });

        it('should return 200 status', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/'];

            const req = createMockReq();
            const res = createMockRes();
            handler(req, res);

            expect(res.statusCode).to.equal(200);
        });

        it('should return response object', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/'];

            const req = createMockReq();
            const res = createMockRes();
            const result = handler(req, res);

            expect(result).to.equal(res);
        });
    });

    describe('GET /spawn', function() {
        it('should increment sheep counter', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/spawn'];

            const initial = sheepGet();
            const req = createMockReq();
            const res = createMockRes();
            handler(req, res);

            expect(sheepGet()).to.equal(initial + 1);
        });

        it('should return 200 status', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/spawn'];

            const req = createMockReq();
            const res = createMockRes();
            handler(req, res);

            expect(res.statusCode).to.equal(200);
        });

        it('should return response object', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/spawn'];

            const req = createMockReq();
            const res = createMockRes();
            const result = handler(req, res);

            expect(result).to.equal(res);
        });

        it('should work multiple times', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/spawn'];

            const req = createMockReq();
            const res = createMockRes();

            handler(req, res);
            handler(req, res);
            handler(req, res);

            expect(sheepGet()).to.equal(3);
        });
    });

    describe('GET /pop', function() {
        it('should decrement sheep counter', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/pop'];

            // First add some sheep
            sheepSpawn();
            sheepSpawn();
            const initial = sheepGet();

            const req = createMockReq();
            const res = createMockRes();
            handler(req, res);

            expect(sheepGet()).to.equal(initial - 1);
        });

        it('should return 200 status', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/pop'];

            const req = createMockReq();
            const res = createMockRes();
            handler(req, res);

            expect(res.statusCode).to.equal(200);
        });

        it('should return response object', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/pop'];

            const req = createMockReq();
            const res = createMockRes();
            const result = handler(req, res);

            expect(result).to.equal(res);
        });

        it('should allow negative count', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/pop'];

            const req = createMockReq();
            const res = createMockRes();

            handler(req, res);
            handler(req, res);

            expect(sheepGet()).to.equal(-2);
        });
    });

    describe('GET /get', function() {
        it('should return current sheep count', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/get'];

            sheepSpawn();
            sheepSpawn();
            sheepSpawn();

            const req = createMockReq();
            const res = createMockRes();
            handler(req, res);

            expect(res.jsonData.message).to.include('3');
        });

        it('should include count message', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/get'];

            sheepSpawn();

            const req = createMockReq();
            const res = createMockRes();
            handler(req, res);

            expect(res.jsonData.message).to.include('Number of sheep in the fold');
        });

        it('should return 200 status', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/get'];

            const req = createMockReq();
            const res = createMockRes();
            handler(req, res);

            expect(res.statusCode).to.equal(200);
        });

        it('should return 0 when no sheep', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/get'];

            const req = createMockReq();
            const res = createMockRes();
            handler(req, res);

            expect(res.jsonData.message).to.include('0');
        });

        it('should return response object', function() {
            const app = createMockApp();
            main(app);
            const handler = app.routes.get['/get'];

            const req = createMockReq();
            const res = createMockRes();
            const result = handler(req, res);

            expect(result).to.equal(res);
        });
    });

    describe('integration scenarios', function() {
        it('should handle spawn and get sequence', function() {
            const app = createMockApp();
            main(app);

            const spawnHandler = app.routes.get['/spawn'];
            const getHandler = app.routes.get['/get'];

            const req = createMockReq();
            const spawnRes = createMockRes();
            const getRes = createMockRes();

            spawnHandler(req, spawnRes);
            spawnHandler(req, spawnRes);
            getHandler(req, getRes);

            expect(getRes.jsonData.message).to.include('2');
        });

        it('should handle spawn, pop and get sequence', function() {
            const app = createMockApp();
            main(app);

            const spawnHandler = app.routes.get['/spawn'];
            const popHandler = app.routes.get['/pop'];
            const getHandler = app.routes.get['/get'];

            const req = createMockReq();
            const res = createMockRes();

            spawnHandler(req, res);
            spawnHandler(req, res);
            spawnHandler(req, res);
            popHandler(req, res);
            getHandler(req, res);

            expect(res.jsonData.message).to.include('2');
        });

        it('should maintain state across route calls', function() {
            const app = createMockApp();
            main(app);

            const spawnHandler = app.routes.get['/spawn'];
            const getHandler = app.routes.get['/get'];

            const req = createMockReq();
            const res1 = createMockRes();
            const res2 = createMockRes();

            spawnHandler(req, res1);
            getHandler(req, res2);

            expect(res2.jsonData.message).to.include('1');
        });
    });
});
