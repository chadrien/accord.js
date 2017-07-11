import { Client, Message } from 'discord.js';
import { Observable } from 'accord/utils/rxjs';
export { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';

export function createMessageStream(discordBot: Client, commandPrefix: string = '') {
  return Observable.fromEvent<Message>(discordBot, 'message')
    .filter(({ content }) => content.startsWith(commandPrefix))
    .filter(({ author: { bot } }) => !bot);
}
