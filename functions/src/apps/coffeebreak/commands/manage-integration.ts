import { SlackCommandRequestBody } from '../../../types/commandRequestBody';
import {
  addChannelIntegration,
  removeChannelIntegration,
  isChannelAlreadyIntegrated,
} from '../repository/coffee-repository';
import { CoffeeBreakChannel } from '../repository/repository.types';
import { postMessageToChat, joinConversation } from '../api/slack';
import { BOT_EMOJI, BOT_NAME } from '../../../config/constants';
import { log } from '../../../util/log';
import { isPrivateChannel } from '../../../util/slack.utils';

const successAddMessage = (channelId: string, channelName: string) =>
  `Success! ${BOT_NAME} will setup the daily coffee matcher in <#${channelId}|${channelName}> every day`;

const successRemoveMessage = (channelId: string, channelName: string) =>
  `Success! ${BOT_NAME} will no longer start the daily coffee matcher in <#${channelId}|${channelName}>`;

const coffeeBreakAddedMessage = (username: string) =>
  `${username} has added ${BOT_NAME} to this channel.
  \nEvery morning, with ${BOT_NAME}, you can opt in to being randomly paired with someone for an informal coffee :coffee: and a chat.
  \nWhen matched, ${BOT_NAME} will start a new conversation for you pair and provide an optional icebreaker to start. You may then run your coffee break however you feel most comfortable.
  \nKeep an eye out for my morning message to opt in!`;

const coffeeBreakRemovedMessage = (username: string) =>
  `${username} has turned off ${BOT_NAME} in this channel. The daily matching will no longer occur`;

async function joinConversationHackToWorkAroundPublicPrivateChannelIssue(channelId: string, channelName: string) {
  if (isPrivateChannel(channelName)) return;
  try {
    await joinConversation({
      channel: channelId,
    });
  } catch (err) {
    if (err.message.includes('method_not_supported_for_channel_type')) return;
    else throw err;
  }
}

export async function addChannel(body: SlackCommandRequestBody) {
  if (await isChannelAlreadyIntegrated(body.channel_id, body.team_id)) {
    return `Channel <#${body.channel_id}|${body.channel_name}> is already setup with ${BOT_NAME}`;
  }
  log(`Adding channel ${body.channel_id} - ${body.channel_name}`);
  const channelDocument: CoffeeBreakChannel = {
    teamDomain: body.team_domain,
    teamId: body.team_id,
    channelId: body.channel_id,
    channelName: body.channel_name,
    createdByUserName: body.user_name,
    createdById: body.user_id,
  };
  await joinConversationHackToWorkAroundPublicPrivateChannelIssue(body.channel_id, body.channel_name);
  await addChannelIntegration(channelDocument);
  await postMessageToChat({
    channel: body.channel_name,
    text: coffeeBreakAddedMessage(channelDocument.createdByUserName),
    icon_emoji: BOT_EMOJI,
  });
  return successAddMessage(channelDocument.channelId, channelDocument.channelName);
}

export async function removeChannel(body: SlackCommandRequestBody) {
  if (!(await isChannelAlreadyIntegrated(body.channel_id, body.team_id))) {
    return `Channel <#${body.channel_id}|${body.channel_name}> is not setup yet with ${BOT_NAME}`;
  }
  log(`Removing channel ${body.channel_id} - ${body.channel_name}`);
  const channelDocument = {
    teamId: body.team_id,
    channelId: body.channel_id,
  };
  await removeChannelIntegration(channelDocument);
  await postMessageToChat({
    channel: body.channel_id,
    text: coffeeBreakRemovedMessage(body.user_name),
    icon_emoji: BOT_EMOJI,
  });
  return successRemoveMessage(body.channel_id, body.channel_name);
}

const regexForChannelId = /(?<=<).*(?=\|)/;
const regexForChannelName = /(?<=\|).*(?=>)/;

function extractChannelIdAndChannelName(command: string): { channelName: string; channelId: string } {
  const channelId = command.match(regexForChannelId);
  const channelName = command.match(regexForChannelName);

  if (!channelId || !channelName) {
    throw new Error('No channel found in the command');
  }

  return {
    channelId: channelId[0],
    channelName: channelName[0],
  };
}
