import { EventEmitter } from 'events';
import { Client, Message, TextChannel, Guild } from 'discord.js';
import { Observable } from 'accord/utils/rxjs';
import { createMessageStream } from 'accord';
import { assertEqual } from 'accord/utils/test';

describe('accord/index.ts', () => {

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

    it('works without prefix', done => {
      assertMessages(createMessageStream(discordBot), [ 'foo', 'bar', '!baz' ], done);
      emitMessages(Observable.from([ 'foo', 'bar', '!baz' ]));
    });

    it('works with prefix', done => {
      assertMessages(createMessageStream(discordBot, '!'), [ '!foo', '!baz' ], done);
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

      assertMessages(createMessageStream(discordBot), [ 'foo', 'bar' ], done);
      emitMessages(message$);
    });

  });

});
