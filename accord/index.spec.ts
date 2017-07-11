import { Observable } from 'accord/utils/rxjs';
import { TextChannel, Message } from 'discord.js';
import { createCommand } from 'accord';
import { assertEqual } from 'accord/utils/test';

describe('accord/index.ts', () => {

  describe('createCommand', () => {

    [
      [ 'with an empty command prefix', '' ],
      [ 'with a command prefix', '!' ],
    ].forEach(([ groupName, commandPrefix ]) => {

      describe(groupName, () => {

        it('can work with a command string', done => {
          const command = createCommand('ping', () => ({
            content: 'pong',
            recipient: {} as TextChannel,
          }));

          let i = 0;
          command(Observable.from([ 'nah', 'ping', 'ping', 'nope ping', 'ping pong' ]).map(content => ({
            message: { content: commandPrefix + content } as Message,
            commandPrefix,
          })))
            .subscribe({
              next({ content }) {
                assertEqual(content, 'pong');
                i++;
              },
              complete() {
                assertEqual(i, 2); // 'ping pong' and 'nope ping' should not be valid
                done();
              },
            });
        });

        it('can work with a command regexp', done => {
          const command = createCommand(/^ping (.+) (.+)$/, (_, arg1, arg2) => ({
            content: `${arg2} ${arg1}`,
            recipient: {} as TextChannel,
          }));

          let i = 0;
          command(Observable.from([ 'nah', 'ping foo bar', 'ping foo bar', 'nope ping foo bar', 'ping pong' ]).map(content => ({
            message: { content: commandPrefix + content } as Message,
            commandPrefix,
          })))
            .subscribe({
              next({ content }) {
                assertEqual(content, 'bar foo');
                i++;
              },
              complete() {
                assertEqual(i, 2); // 'ping pong' and 'nope ping foo bar' should not be valid
                done();
              },
            });
        });

      });

    });

  });

});
