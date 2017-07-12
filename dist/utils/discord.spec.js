"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var discord_1 = require("accord/utils/discord");
var rxjs_1 = require("accord/utils/rxjs");
var test_1 = require("accord/utils/test");
var accord_1 = require("accord");
describe('accord/utils/discord.ts', function () {
    describe('createMessageStream()', function () {
        var discordBot;
        function emitMessages(message$) {
            message$.subscribe({
                next: function (content) {
                    var message = typeof content !== 'string' ? content : {
                        author: {
                            bot: false,
                        },
                        content: content,
                    };
                    discordBot.emit('message', message);
                },
                complete: function () { return discordBot.emit('close'); },
            });
        }
        function assertMessages(actual$, expectations, done) {
            actual$
                .takeUntil(rxjs_1.Observable.fromEvent(discordBot, 'close'))
                .subscribe({
                next: function (_a) {
                    var content = _a.content;
                    test_1.assertEqual(content, expectations.shift());
                },
                error: done,
                complete: done,
            });
        }
        beforeEach(function () {
            discordBot = new events_1.EventEmitter(); // we don't need an actual client, we just need to be able to emit `message` events
        });
        it('works with an empty prefix', function (done) {
            var message$ = discord_1.createMessageStream(discordBot, '');
            assertMessages(message$, ['foo', 'bar', '!baz'], done);
            emitMessages(rxjs_1.Observable.from(['foo', 'bar', '!baz']));
        });
        it('works with prefix', function (done) {
            var message$ = discord_1.createMessageStream(discordBot, '!');
            assertMessages(message$, ['!foo', '!baz'], done);
            emitMessages(rxjs_1.Observable.from(['!foo', 'bar', '!baz']));
        });
        it('filters out messages from bots', function (done) {
            var message$ = rxjs_1.Observable.from([
                'foo',
                'bar',
                {
                    content: 'baz',
                    author: {
                        bot: true,
                    },
                },
            ]);
            assertMessages(discord_1.createMessageStream(discordBot, ''), ['foo', 'bar'], done);
            emitMessages(message$);
        });
    });
    describe.only('createResponseStream()', function () {
        it('works with an empty prefix', function (done) {
            var pingCommand = accord_1.createCommand('ping', function (message) { return ({
                content: 'pong',
                recipient: {},
            }); });
            var pongCommand = accord_1.createCommand('pong', function (message) { return ({
                content: 'ping',
                recipient: {},
            }); });
            var message$ = rxjs_1.Observable.from(['nope', 'ping', 'nope', 'pong', 'nope'])
                .map(function (content) { return ({ content: content }); });
            var i = 0;
            discord_1.createResponseStream(message$, [pingCommand, pongCommand], '')
                .subscribe({
                next: function (_a) {
                    var content = _a.content;
                    if (i === 0) {
                        test_1.assertEqual(content, 'pong'); // first it should respond to 'ping'
                    }
                    else if (i === 1) {
                        test_1.assertEqual(content, 'ping'); // then it should respond to 'pong'
                    }
                    i++;
                },
                error: done,
                complete: function () {
                    test_1.assertEqual(i, 2);
                    done();
                },
            });
        });
        it('works with a prefix', function (done) {
            var pingCommand = accord_1.createCommand('ping', function (message) { return ({
                content: 'pong',
                recipient: {},
            }); });
            var pongCommand = accord_1.createCommand('pong', function (message) { return ({
                content: 'ping',
                recipient: {},
            }); });
            var message$ = rxjs_1.Observable.from(['pong', '!ping', 'ping', '!pong', '!nope'])
                .map(function (content) { return ({ content: content }); });
            var i = 0;
            discord_1.createResponseStream(message$, [pingCommand, pongCommand], '!')
                .subscribe({
                next: function (_a) {
                    var content = _a.content;
                    if (i === 0) {
                        test_1.assertEqual(content, 'pong'); // first it should respond to 'ping'
                    }
                    else if (i === 1) {
                        test_1.assertEqual(content, 'ping'); // then it should respond to 'pong'
                    }
                    i++;
                },
                error: done,
                complete: function () {
                    test_1.assertEqual(i, 2);
                    done();
                },
            });
        });
    });
});
