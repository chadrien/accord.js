"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("accord.js/utils/rxjs");
function createMessageStream(discordBot, commandPrefix) {
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
function createResponseStream(message$, commands, commandPrefix) {
    return commands
        .reduce(function (mergedResponse$, command) { return mergedResponse$.merge(command(message$.map(function (message) { return ({ message: message, commandPrefix: commandPrefix }); }))); }, rxjs_1.Observable.empty());
}
exports.createResponseStream = createResponseStream;
