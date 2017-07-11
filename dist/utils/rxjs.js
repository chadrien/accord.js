"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("accord/utils/rxjs");
var Observable_1 = require("rxjs/Observable");
exports.Observable = Observable_1.Observable;
require("rxjs/add/observable/fromEvent");
require("rxjs/add/observable/empty");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/map");
require("rxjs/add/operator/zip");
require("rxjs/add/operator/merge");
require("rxjs/add/operator/mergeMap");
function createMessageStream(discordBot, commandPrefix) {
    if (commandPrefix === void 0) { commandPrefix = ''; }
    return rxjs_1.Observable.fromEvent(discordBot, 'message')
        .filter(function (_a) {
        var content = _a.content;
        return content.startsWith(commandPrefix);
    })
        .filter(function (_a) {
        var bot = _a.author.bot;
        return !bot;
    });
}
exports.createMessageStream = createMessageStream;
