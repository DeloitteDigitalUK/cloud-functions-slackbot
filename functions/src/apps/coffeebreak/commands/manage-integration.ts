import { SlackCommandRequestBody } from '../../../types/commandRequestBody';
import {
  addChannelIntegration,
  removeChannelIntegration,
  isChannelAlreadyIntegrated,
} from '../repository/coffee-repository';
import { CoffeeBreakChannel } from '../repository/repository.types';
import { postMessageToChat, joinConversation } from '../api/slack';
import { BOT_EMOJI } from '../../../config/constants';

const successAddMessage = (channelId: string, channelName: string) =>
  `Success! Coffeebreak will setup the daily coffee matcher in <#${channelId}|${channelName}> every day`;

const successRemoveMessage = (channelId: string, channelName: string) =>
  `Success! Coffeebreak will no longer start the daily coffee matcher in <#${channelId}|${channelName}>`;

export async function addChannel(body: SlackCommandRequestBody) {
  if (await isChannelAlreadyIntegrated(body.channel_id, body.team_id)) {
    return `Channel <#${body.channel_id}|${body.channel_name}> is already setup with CoffeeBreak`;
  }
  const channelDocument: CoffeeBreakChannel = {
    teamDomain: body.team_domain,
    teamId: body.team_id,
    channelId: body.channel_id,
    channelName: body.channel_name,
    createdByUserName: body.user_name,
    createdById: body.user_id,
  };
  await joinConversation({
    channel: body.channel_id,
  });
  await addChannelIntegration(channelDocument);
  await postMessageToChat({
    channel: body.channel_name,
    text: `${channelDocument.createdByUserName} has added CoffeeBreak to this channel.\nEveryday, through Coffeebreak, you can opt in to being randomly paired with someone for a coffeee and a chat.\nLook out for my morning message!`,
    icon_emoji: BOT_EMOJI,
  });
  return successAddMessage(channelDocument.channelId, channelDocument.channelName);
}

export async function removeChannel(body: SlackCommandRequestBody) {
  if (!(await isChannelAlreadyIntegrated(body.channel_id, body.team_id))) {
    return `Channel <#${body.channel_id}|${body.channel_name}> is not setup yet with CoffeeBreak`;
  }
  const channelDocument = {
    teamId: body.team_id,
    channelId: body.channel_id,
  };
  await removeChannelIntegration(channelDocument);
  await postMessageToChat({
    channel: body.channel_name,
    text: `${body.user_name} has turned off CoffeeBreak. The daily matching will now not occur.`,
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
