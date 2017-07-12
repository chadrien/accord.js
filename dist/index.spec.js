"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("accord/utils/rxjs");
var accord_1 = require("accord");
var test_1 = require("accord/utils/test");
describe('accord/index.ts', function () {
    describe('createCommand', function () {
        [
            ['with an empty command prefix', ''],
            ['with a command prefix', '!'],
        ].forEach(function (_a) {
            var groupName = _a[0], commandPrefix = _a[1];
            describe(groupName, function () {
                it('can work with a command string', function (done) {
                    var command = accord_1.createCommand('ping', function () { return ({
                        content: 'pong',
                        recipient: {},
                    }); });
                    var i = 0;
                    command(rxjs_1.Observable.from(['nah', 'ping', 'ping', 'nope ping', 'ping pong']).map(function (content) { return ({
                        message: { content: commandPrefix + content },
                        commandPrefix: commandPrefix,
                    }); }))
                        .subscribe({
                        next: function (_a) {
                            var content = _a.content;
                            test_1.assertEqual(content, 'pong');
                            i++;
                        },
                        complete: function () {
                            test_1.assertEqual(i, 2); // 'ping pong' and 'nope ping' should not be valid
                            done();
                        },
                    });
                });
                it('can work with a command regexp', function (done) {
                    var command = accord_1.createCommand(/^ping (.+) (.+)$/, function (_, arg1, arg2) { return ({
                        content: arg2 + " " + arg1,
                        recipient: {},
                    }); });
                    var i = 0;
                    command(rxjs_1.Observable.from(['nah', 'ping foo bar', 'ping foo bar', 'nope ping foo bar', 'ping pong']).map(function (content) { return ({
                        message: { content: commandPrefix + content },
                        commandPrefix: commandPrefix,
                    }); }))
                        .subscribe({
                        next: function (_a) {
                            var content = _a.content;
                            test_1.assertEqual(content, 'bar foo');
                            i++;
                        },
                        complete: function () {
                            test_1.assertEqual(i, 2); // 'ping pong' and 'nope ping foo bar' should not be valid
                            done();
                        },
                    });
                });
            });
        });
    });
});
