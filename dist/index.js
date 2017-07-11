"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("accord/utils/rxjs");
/**
 * `bootstrapBot` is used to start your bot, though it does not log the bot in or anything extra,
 * this kind of things are to be done in userland© and should not be the responsibility of Accord.
 *
 * The `commandPrefix` is what allows you to have for example commands like this: !ping, where '!' is the command prefix.
 */
function bootstrapBot(discordBot, commands, commandPrefix) {
    if (commandPrefix === void 0) { commandPrefix = ''; }
    var message$ = rxjs_1.createMessageStream(discordBot, commandPrefix);
    var response$ = commands
        .reduce(function (mergedResponse$, command) { return mergedResponse$.merge(command(message$.map(function (message) { return ({ message: message, commandPrefix: commandPrefix }); }))); }, rxjs_1.Observable.empty());
    return response$.subscribe({
        next: function (_a) {
            var recipient = _a.recipient, content = _a.content, options = _a.options;
            return recipient.send(content, options)
                .catch(console.error);
        },
        error: console.error,
        complete: function () { return console.log('Response stream completed'); },
    });
}
exports.bootstrapBot = bootstrapBot;
/**
 * Super simple function to create a command either from a string, in which case it will internally
 * be transformed to a RegExp like this: 'ping' => /^ping$/; or a RegExp.
 *
 * Using a RegExp allows to have more control on what you want to match, and also allows you to
 * use capturing parentheses to then use parts of the command in the responder.
 */
function createCommand(command, responder) {
    var regExpToString = function (regExp) { return regExp.toString().replace(/^\/|\/$/g, ''); };
    var commandString = typeof command === 'string' ? "^" + command + "$" : regExpToString(command);
    var getCommandRegExp = function (commandPrefix) { return new RegExp(commandString.replace(/^(\^?)(.*)$/, "$1" + commandPrefix + "$2")); };
    return function (data$) { return data$
        .filter(function (_a) {
        var message = _a.message, commandPrefix = _a.commandPrefix;
        return getCommandRegExp(commandPrefix).test(message.content);
    })
        .mergeMap(function (_a) {
        var message = _a.message, commandPrefix = _a.commandPrefix;
        var responderArgs = (message.content.match(getCommandRegExp(commandPrefix)) || []).slice(1);
        return Promise.resolve()
            .then(function () { return responder.apply(null, [message].concat(responderArgs)); });
    }); };
}
exports.createCommand = createCommand;
