import {
  ChatPostMessageArguments,
  ReactionsGetArguments,
  ConversationsOpenArguments,
  ConversationsJoinArguments,
  ConversationsLeaveArguments,
} from '@slack/web-api';
import { SlackWebClient } from '..';
import { as } from '../../../util/type.utils';
import { WebApiPostMessageResponse, WebApiGetReactionsResponse, WebApiConversationResponse } from './api.types';

export async function postMessageToChat(options: ChatPostMessageArguments) {
  return as<WebApiPostMessageResponse>(await SlackWebClient.chat.postMessage(options));
}

export async function getReactionsForMessage(options: ReactionsGetArguments) {
  return as<WebApiGetReactionsResponse>(await SlackWebClient.reactions.get(options));
}

export async function openConversation(options: ConversationsOpenArguments) {
  return as<WebApiConversationResponse>(await SlackWebClient.conversations.open(options));
}

export async function joinConversation(options: ConversationsJoinArguments) {
  return as<WebApiConversationResponse>(await SlackWebClient.conversations.join(options));
}

export async function leaveConversation(options: ConversationsLeaveArguments) {
  return as<WebApiConversationResponse>(await SlackWebClient.conversations.leave(options));
}
