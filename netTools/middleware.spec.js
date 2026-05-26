import chai from 'chai';
const expect = chai.expect;
import { update } from './middleware.js';

function createMockRes() {
    return {
        headersSent: false,
        statusCode: null,
        jsonData: null,
        writeHeadData: null,
        writeData: [],
        endCalled: false,
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        json: function(data) {
            this.jsonData = data;
            return this;
        },
        writeHead: function(code, headers) {
            this.writeHeadData = { code, headers };
            return this;
        },
        write: function(data) {
            this.writeData.push(data);
            return this;
        },
        end: function() {
            this.endCalled = true;
            return this;
        }
    };
}

function createMockReq() {
    return {
        listeners: {},
        on: function(event, callback) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(callback);
            return this;
        }
    };
}

describe('middleware', function() {

    describe('update', function() {
        it('should add _200 method to response', function() {
            const req = createMockReq();
            const res = createMockRes();
            let nextCalled = false;

            update(req, res, () => { nextCalled = true; });

            expect(res._200).to.be.a('function');
            expect(nextCalled).to.be.true;
        });

        it('should add _400 method to response', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});

            expect(res._400).to.be.a('function');
        });

        it('should add _401 method to response', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});

            expect(res._401).to.be.a('function');
        });

        it('should add _403 method to response', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});

            expect(res._403).to.be.a('function');
        });

        it('should add _404 method to response', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});

            expect(res._404).to.be.a('function');
        });

        it('should add _429 method to response', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});

            expect(res._429).to.be.a('function');
        });

        it('should add _500 method to response', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});

            expect(res._500).to.be.a('function');
        });

        it('should add _handle_callback method to response', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});

            expect(res._handle_callback).to.be.a('function');
        });

        it('should add _open_stream method to response', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});

            expect(res._open_stream).to.be.a('function');
        });
    });

    describe('_200 method added by middleware', function() {
        it('should call responseTools._200 with correct params', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});
            res._200('test message', 'ok');

            expect(res.statusCode).to.equal(200);
            expect(res.jsonData.message).to.include('test message');
        });

        it('should work with string message', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});
            res._200('Welcome!');

            expect(res.statusCode).to.equal(200);
            expect(res.jsonData.message).to.equal('Ok: Welcome!');
        });
    });

    describe('_400 method added by middleware', function() {
        it('should call responseTools._400', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});
            const err = new Error('bad input');
            res._400(err, 'invalid request');

            expect(res.statusCode).to.equal(400);
            expect(res.jsonData.err).to.equal(err);
        });
    });

    describe('_401 method added by middleware', function() {
        it('should call responseTools._401', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});
            const err = new Error('unauthorized');
            res._401(err, 'invalid token');

            expect(res.statusCode).to.equal(401);
            expect(res.jsonData.err).to.equal(err);
        });
    });

    describe('_403 method added by middleware', function() {
        it('should call responseTools._403', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});
            const err = new Error('forbidden');
            res._403(err, 'insufficient permissions');

            expect(res.statusCode).to.equal(403);
            expect(res.jsonData.err).to.equal(err);
        });
    });

    describe('_404 method added by middleware', function() {
        it('should call responseTools._404', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});
            const err = new Error('not found');
            res._404(err, 'resource not found');

            expect(res.statusCode).to.equal(404);
            expect(res.jsonData.err).to.equal(err);
        });
    });

    describe('_429 method added by middleware', function() {
        it('should call responseTools._429', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});
            const err = new Error('rate limit');
            res._429(err, 'too many requests');

            expect(res.statusCode).to.equal(429);
            expect(res.jsonData.err).to.equal(err);
        });
    });

    describe('_500 method added by middleware', function() {
        it('should call responseTools._500', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});
            const err = new Error('server error');
            res._500(err, 'database error');

            expect(res.statusCode).to.equal(500);
            expect(res.jsonData.err).to.equal(err);
        });
    });

    describe('_handle_callback method', function() {
        it('should send _500 on error', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});
            const err = new Error('callback error');
            res._handle_callback(err, null);

            expect(res.statusCode).to.equal(500);
            expect(res.jsonData.err).to.equal(err);
        });

        it('should send _200 on success', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});
            const obj = { success: true };
            res._handle_callback(null, obj);

            expect(res.statusCode).to.equal(200);
            expect(res.jsonData.obj).to.deep.equal(obj);
        });

        it('should handle null obj', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});
            res._handle_callback(null, null);

            expect(res.statusCode).to.equal(200);
        });
    });

    describe('_open_stream method', function() {
        it('should return stream object', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});
            const stream = res._open_stream('test-hash');

            expect(stream).to.have.property('process');
            expect(stream).to.have.property('close');
            expect(stream).to.have.property('onClose');
        });

        it('should write SSE headers', function() {
            const req = createMockReq();
            const res = createMockRes();

            update(req, res, () => {});
            res._open_stream('hash');

            expect(res.writeHeadData.code).to.equal(200);
            expect(res.writeHeadData.headers['Content-Type']).to.equal('text/event-stream');
        });
    });

    describe('next() call', function() {
        it('should call next callback', function() {
            const req = createMockReq();
            const res = createMockRes();
            let nextCalled = false;

            update(req, res, () => { nextCalled = true; });

            expect(nextCalled).to.be.true;
        });
    });
});
