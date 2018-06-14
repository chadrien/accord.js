import { EventEmitter } from 'events';
import { Client, Message, TextChannel, Guild } from 'discord.js';
import { createMessageStream, createResponseStream } from 'accord.js/utils/discord';
import { Observable } from 'accord.js/utils/rxjs';
import { assertEqual } from 'accord.js/utils/test';
import { createCommand } from 'accord.js';

describe('accord.js/utils/discord.ts', () => {

  describe('createMessageStream()', () => {

    let discordBot: Client;

    function emitMessages(message$: Observable<string | Message>): void {
      message$.subscribe({
        next(content) {
          const message = typeof content !== 'string' ? content : {
            author: {
              bot: false,
            },
            content,
          };
          discordBot.emit('message', message);
        },
        complete: () => discordBot.emit('close'),
      });
    }

    function assertMessages(actual$: Observable<Message>, expectations: string[], done: any): void {
      actual$
        .takeUntil(Observable.fromEvent(discordBot, 'close'))
        .subscribe({
          next({ content }) {
            assertEqual(content, expectations.shift());
          },
          error: done,
          complete: done,
        });
    }

    beforeEach(() => {
      discordBot = new EventEmitter() as Client; // we don't need an actual client, we just need to be able to emit `message` events
    });

    it('works with an empty prefix', done => {
      const message$ = createMessageStream(discordBot, '');
      assertMessages(message$, [ 'foo', 'bar', '!baz' ], done);
      emitMessages(Observable.from([ 'foo', 'bar', '!baz' ]));
    });

    it('works with prefix', done => {
      const message$ = createMessageStream(discordBot, '!');
      assertMessages(message$, [ '!foo', '!baz' ], done);
      emitMessages(Observable.from([ '!foo', 'bar', '!baz' ]));
    });

    it('filters out messages from bots', done => {
      const message$ = Observable.from([
        'foo',
        'bar',
        {
          content: 'baz',
          author: {
            bot: true,
          },
        } as Message,
      ]);

      assertMessages(createMessageStream(discordBot, ''), [ 'foo', 'bar' ], done);
      emitMessages(message$);
    });

  });

  describe('createResponseStream()', () => {

    it('works with an empty prefix', done => {
      const pingCommand = createCommand('ping', message => ({
        content: 'pong',
        recipient: {} as TextChannel,
      }));
      const pongCommand = createCommand('pong', message => ({
        content: 'ping',
        recipient: {} as TextChannel,
      }));
      const message$ = Observable.from([ 'nope', 'ping', 'nope', 'pong', 'nope' ])
        .map(content => ({ content } as Message));

      let i = 0;
      createResponseStream(message$, [ pingCommand, pongCommand ], '')
        .subscribe({
          next({ content }) {
            if (i === 0) {
              assertEqual(content, 'pong'); // first it should respond to 'ping'
            } else if (i === 1) {
              assertEqual(content, 'ping'); // then it should respond to 'pong'
            }
            i++;
          },
          error: done,
          complete() {
            assertEqual(i, 2);
            done();
          },
        });
    });

    it('works with a prefix', done => {
      const pingCommand = createCommand('ping', message => ({
        content: 'pong',
        recipient: {} as TextChannel,
      }));
      const pongCommand = createCommand('pong', message => ({
        content: 'ping',
        recipient: {} as TextChannel,
      }));
      const message$ = Observable.from([ 'pong', '!ping', 'ping', '!pong', '!nope' ])
        .map(content => ({ content } as Message));

      let i = 0;
      createResponseStream(message$, [ pingCommand, pongCommand ], '!')
        .subscribe({
          next({ content }) {
            if (i === 0) {
              assertEqual(content, 'pong'); // first it should respond to 'ping'
            } else if (i === 1) {
              assertEqual(content, 'ping'); // then it should respond to 'pong'
            }
            i++;
          },
          error: done,
          complete() {
            assertEqual(i, 2);
            done();
          },
        });
    });

  });

});
