/**
 * Created at 10/06/2018
 * By Adrien
 */
/* global console */

export {
    open_stream,
    _200,
    _400,
    _401,
    _403,
    _404,
    _429,
    _500
};
    /**
     * Open stream with code 206: Partial Content.
     * @param req - Request
     * @param res - Response
     * @param hash - Use as a key for the streaming (client side)
     * @returns {{process: function(*=, *=), close: function()}}
     */
    function open_stream(req, res, hash) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'
        });

        const stream = {
            process: function (err, obj) {
                const elt = {
                    status: 200,
                    message: 'Partial Content.',
                    obj: obj || {},
                    // hash: hash,
                    err: err || null
                };
                res.write('data: ' + JSON.stringify(elt) + '\n\n');
                return stream;
            },
            close: function () {
                res.end();
                stream.process = function () {
                };
                return stream;
            },

            onClose: function(callback) {
                req.on("close", callback);
                req.on("end", callback);
                return stream;
            }
        };
        return stream;
    }

    /**
     * Response with status 200: Ok
     * @param res - Request/response
     * @param [msg] - Message to send back
     * @param [obj] - Object to send back
     * @returns {*}
     * @public
     */
    function _200(res, msg, obj) {
        if (res.headersSent) {
            return console.log('WARN: Header already sent. Aborting...');
        }
        return res.status(200).json({
            status: 200,
            message: msg ? 'Ok: ' + msg : 'Ok.',
            obj: obj || {},
            err: null
        });
    }

    /**
     * Response with status 400: Bad request
     * @param res - Request/response
     * @param [msg] - Message to send back
     * @param [err] - Error to send back
     * @returns {*}
     * @public
     */
    function _400 (res, msg, err) {
        if (res.headersSent) {
            return console.log('WARN: Header already sent. Aborting...');
        }
        return res.status(400).json({
            status: 400,
            message: msg ? 'Bad request: ' + msg : 'Bad request.',
            obj: null,
            err: err || new Error()
        });
    }

    /**
     * Response with status 403: Authentication errors
     * @param res - Request/response
     * @param [msg] - Message to send back
     * @param [err] - Error to send back
     * @returns {*}
     * @public
     */
    function _401 (res, msg, err) {
        if (res.headersSent) {
            return console.log('WARN: Header already sent. Aborting...');
        }
        return res.status(401).json({
            status: 401,
            message: msg ? 'Authentication errors: ' + msg : 'Authentication errors.',
            obj: null,
            err: err || new Error(msg ? 'Authentication errors: ' + msg : 'Authentication errors.')
        });
    }

    /**
     * Response with status 403: Forbidden
     * @param res - Request/response
     * @param [msg] - Message to send back
     * @param [err] - Error to send back
     * @returns {*}
     * @public
     */
    function _403 (res, msg, err) {
        if (res.headersSent) {
            return console.log('WARN: Header already sent. Aborting...');
        }
        return res.status(403).json({
            status: 403,
            message: msg ? 'Forbidden: ' + msg : 'Forbidden.',
            obj: null,
            err: err || new Error()
        });
    }

    /**
     * Response with status 404: Not found
     * @param res - Request/response
     * @param [msg] - Message to send back
     * @param [err] - Error to send back
     * @returns {*}
     * @public
     */
    function _404 (res, msg, err) {
        if (res.headersSent) {
            return console.log('WARN: Header already sent. Aborting...');
        }
        return res.status(404).json({
            status: 404,
            message: msg ? 'Not found: ' + msg : 'Not found.',
            obj: null,
            err: err || new Error()
        });
    }

    /**
     * Response with status 404: Too Many Requests
     * @param res - Request/response
     * @param [msg] - Message to send back
     * @param [err] - Error to send back
     * @returns {*}
     * @public
     */
    function _429 (res, msg, err) {
        if (res.headersSent) {
            return console.log('WARN: Header already sent. Aborting...');
        }
        return res.status(429).json({
            status: 429,
            message: msg ? 'Too Many Requests: ' + msg : 'Too Many Requests.',
            obj: null,
            err: err || new Error(msg ? 'Too Many Requests: ' + msg : 'Too Many Requests.')
        });
    }

    /**
     * Response with status 500: Internal error
     * @param res - Request/response
     * @param [msg] - Message to send back
     * @param [err] - Error to send back
     * @returns {*}
     * @public
     */
    function _500 (res, msg, err) {
        if (res.headersSent) {
            return console.log('WARN: Header already sent. Aborting...');
        }
        return res.status(500).json({
            status: 500,
            message: msg ? 'Internal error: ' + msg : 'Internal error.',
            obj: null,
            err: err || new Error()
        });
    }