import chai from 'chai';
const expect = chai.expect;
import {
    _200, _400, _401, _403, _404, _429, _500, open_stream
} from './responseTools.js';

// Mock response object
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

describe('responseTools', function() {

    describe('_200', function() {
        it('should return 200 status', function() {
            const res = createMockRes();
            _200(res, 'test message', { key: 'value' });
            expect(res.statusCode).to.equal(200);
        });

        it('should format message with prefix', function() {
            const res = createMockRes();
            _200(res, 'test message');
            expect(res.jsonData.message).to.equal('Ok: test message');
        });

        it('should use default message when not provided', function() {
            const res = createMockRes();
            _200(res);
            expect(res.jsonData.message).to.equal('Ok.');
        });

        it('should include status in response', function() {
            const res = createMockRes();
            _200(res, 'msg');
            expect(res.jsonData.status).to.equal(200);
        });

        it('should include object in response', function() {
            const res = createMockRes();
            const obj = { key: 'value', num: 42 };
            _200(res, 'msg', obj);
            expect(res.jsonData.obj).to.deep.equal(obj);
        });

        it('should set err to null', function() {
            const res = createMockRes();
            _200(res, 'msg');
            expect(res.jsonData.err).to.be.null;
        });

        it('should not send if headers already sent', function() {
            const res = createMockRes();
            res.headersSent = true;
            const result = _200(res);
            expect(result).to.be.undefined;
        });

        it('should use empty object when obj not provided', function() {
            const res = createMockRes();
            _200(res, 'msg');
            expect(res.jsonData.obj).to.deep.equal({});
        });
    });

    describe('_400', function() {
        it('should return 400 status', function() {
            const res = createMockRes();
            _400(res, 'bad input');
            expect(res.statusCode).to.equal(400);
        });

        it('should format message with prefix', function() {
            const res = createMockRes();
            _400(res, 'invalid data');
            expect(res.jsonData.message).to.equal('Bad request: invalid data');
        });

        it('should use default message when not provided', function() {
            const res = createMockRes();
            _400(res);
            expect(res.jsonData.message).to.equal('Bad request.');
        });

        it('should include error in response', function() {
            const err = new Error('test error');
            const res = createMockRes();
            _400(res, 'msg', err);
            expect(res.jsonData.err).to.equal(err);
        });

        it('should create error when not provided', function() {
            const res = createMockRes();
            _400(res, 'msg');
            expect(res.jsonData.err).to.be.an('error');
        });
    });

    describe('_401', function() {
        it('should return 401 status', function() {
            const res = createMockRes();
            _401(res, 'invalid token');
            expect(res.statusCode).to.equal(401);
        });

        it('should format message with prefix', function() {
            const res = createMockRes();
            _401(res, 'expired token');
            expect(res.jsonData.message).to.equal('Authentication errors: expired token');
        });

        it('should use default message when not provided', function() {
            const res = createMockRes();
            _401(res);
            expect(res.jsonData.message).to.equal('Authentication errors.');
        });

        it('should include error', function() {
            const err = new Error('auth failed');
            const res = createMockRes();
            _401(res, 'msg', err);
            expect(res.jsonData.err).to.equal(err);
        });
    });

    describe('_403', function() {
        it('should return 403 status', function() {
            const res = createMockRes();
            _403(res, 'insufficient permissions');
            expect(res.statusCode).to.equal(403);
        });

        it('should format message with prefix', function() {
            const res = createMockRes();
            _403(res, 'admin only');
            expect(res.jsonData.message).to.equal('Forbidden: admin only');
        });

        it('should use default message when not provided', function() {
            const res = createMockRes();
            _403(res);
            expect(res.jsonData.message).to.equal('Forbidden.');
        });
    });

    describe('_404', function() {
        it('should return 404 status', function() {
            const res = createMockRes();
            _404(res, 'resource not found');
            expect(res.statusCode).to.equal(404);
        });

        it('should format message with prefix', function() {
            const res = createMockRes();
            _404(res, 'user not found');
            expect(res.jsonData.message).to.equal('Not found: user not found');
        });

        it('should use default message when not provided', function() {
            const res = createMockRes();
            _404(res);
            expect(res.jsonData.message).to.equal('Not found.');
        });
    });

    describe('_429', function() {
        it('should return 429 status', function() {
            const res = createMockRes();
            _429(res, 'rate limit exceeded');
            expect(res.statusCode).to.equal(429);
        });

        it('should format message with prefix', function() {
            const res = createMockRes();
            _429(res, 'too many requests');
            expect(res.jsonData.message).to.equal('Too Many Requests: too many requests');
        });

        it('should use default message when not provided', function() {
            const res = createMockRes();
            _429(res);
            expect(res.jsonData.message).to.equal('Too Many Requests.');
        });
    });

    describe('_500', function() {
        it('should return 500 status', function() {
            const res = createMockRes();
            _500(res, 'internal error');
            expect(res.statusCode).to.equal(500);
        });

        it('should format message with prefix', function() {
            const res = createMockRes();
            _500(res, 'database error');
            expect(res.jsonData.message).to.equal('Internal error: database error');
        });

        it('should use default message when not provided', function() {
            const res = createMockRes();
            _500(res);
            expect(res.jsonData.message).to.equal('Internal error.');
        });
    });

    describe('open_stream', function() {
        it('should write correct headers', function() {
            const req = createMockReq();
            const res = createMockRes();
            open_stream(req, res, 'test-hash');

            expect(res.writeHeadData.code).to.equal(200);
            expect(res.writeHeadData.headers['Content-Type']).to.equal('text/event-stream');
        });

        it('should set correct SSE headers', function() {
            const req = createMockReq();
            const res = createMockRes();
            open_stream(req, res, 'hash');

            expect(res.writeHeadData.headers['Cache-Control']).to.equal('no-cache');
            expect(res.writeHeadData.headers['Connection']).to.equal('keep-alive');
            expect(res.writeHeadData.headers['X-Accel-Buffering']).to.equal('no');
        });

        it('should return stream object', function() {
            const req = createMockReq();
            const res = createMockRes();
            const stream = open_stream(req, res, 'hash');

            expect(stream).to.have.property('process');
            expect(stream).to.have.property('close');
            expect(stream).to.have.property('onClose');
        });

        it('stream.process should write data', function() {
            const req = createMockReq();
            const res = createMockRes();
            const stream = open_stream(req, res, 'hash');

            stream.process(null, { key: 'value' });
            expect(res.writeData.length).to.equal(1);
            expect(res.writeData[0]).to.include('data:');
        });

        it('stream.process should format JSON correctly', function() {
            const req = createMockReq();
            const res = createMockRes();
            const stream = open_stream(req, res, 'hash');

            stream.process(null, { test: 'data' });
            const written = res.writeData[0];
            expect(written).to.include('status: 200');
            expect(written).to.include('Partial Content');
        });

        it('stream.process should include error when provided', function() {
            const req = createMockReq();
            const res = createMockRes();
            const stream = open_stream(req, res, 'hash');

            const err = new Error('test error');
            stream.process(err, null);
            const written = res.writeData[0];
            expect(written).to.include('test error');
        });

        it('stream.process should return stream for chaining', function() {
            const req = createMockReq();
            const res = createMockRes();
            const stream = open_stream(req, res, 'hash');

            const result = stream.process(null, {});
            expect(result).to.equal(stream);
        });

        it('stream.close should end response', function() {
            const req = createMockReq();
            const res = createMockRes();
            const stream = open_stream(req, res, 'hash');

            stream.close();
            expect(res.endCalled).to.be.true;
        });

        it('stream.onClose should register request close handler', function() {
            const req = createMockReq();
            const res = createMockRes();
            const stream = open_stream(req, res, 'hash');

            const callback = () => {};
            const result = stream.onClose(callback);

            expect(req.listeners['close']).to.include(callback);
            expect(req.listeners['end']).to.include(callback);
            expect(result).to.equal(stream);
        });

        it('stream.onClose should return stream for chaining', function() {
            const req = createMockReq();
            const res = createMockRes();
            const stream = open_stream(req, res, 'hash');

            const result = stream.onClose(() => {});
            expect(result).to.equal(stream);
        });
    });
});
