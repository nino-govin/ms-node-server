/**
 * Created at 18/09/2018
 * By Adrien
 */
/* global console */
/* jshint -W069 */

import * as RT from './responseTools.js';

export { update };

function update(req, res, next) {

    res['_handle_callback'] = function(err, obj) {
        if (err) {
            console.error(err);
            return RT._500(res, err.message, err);
        }
        return RT._200(res, null, obj);
    };
    res['_open_stream'] = function(hash) {
        return RT.open_stream(req, res, hash);
    };
    res['_200'] = function(obj, msg) {
        return RT._200(res, msg, obj);
    };
    res['_400'] = function(err, msg) {
        console.error(err);
        return RT._400(res, msg, err);
    };
    res['_401'] = function(err, msg) {
        console.error(err);
        return RT._401(res, msg, err);
    };
    res['_403'] = function(err, msg) {
        console.error(err);
        return RT._403(res, msg, err);
    };
    res['_404'] = function(err, msg) {
        console.error(err);
        return RT._404(res, msg, err);
    };
    res['_429'] = function(err, msg) {
        console.error(err);
        return RT._429(res, msg, err);
    };
    res['_500'] = function(err, msg) {
        console.error(err);
        return RT._500(res, msg, err);
    };

    return next();
}