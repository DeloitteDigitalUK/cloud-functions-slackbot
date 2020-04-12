import { BOT_NAME, BOT_EMOJI } from '../../config/constants';
import { WebClient } from '@slack/web-api';
import bodyParser from 'body-parser';
import express from 'express';
import { postDailyMessage } from './commands/post-daily-message';
import { createPairConversations } from './commands/match-users';
import { SLACK_TOKEN } from '../../config/env';
import { addChannel, removeChannel } from './commands/manage-integration';

console.log('Starting up ' + BOT_NAME);
// Create a new instance of the WebClient class with the token read from your environment variable
export const SlackWebClient = new WebClient(SLACK_TOKEN);

const CoffeeBreakApp = express();

CoffeeBreakApp.use(bodyParser.urlencoded({ extended: true }));
CoffeeBreakApp.use(bodyParser.json());

CoffeeBreakApp.post('/morning', async (req, res) => {
  await postDailyMessage().then(() => res.send('Morning messages sent'));
});

CoffeeBreakApp.post('/match', async (req, res) => {
  await createPairConversations().then(() => res.send('Matching'));
});

CoffeeBreakApp.post('*', async (req, res) => {
  const command: string = req.body.text;

  if (command.toLowerCase().includes('add')) {
    addChannel(req.body)
      .then((message) => res.send(message))
      .catch((err) => res.send('Error! ' + err.message));
  } else if (command.toLowerCase().includes('remove')) {
    removeChannel(req.body)
      .then((message) => res.send(message))
      .catch((err) => res.send('Error! ' + err.message));
  } else {
    res.send('Error! Unknown command - Use either [add] or [remove]');
  }
});

export default CoffeeBreakApp;
