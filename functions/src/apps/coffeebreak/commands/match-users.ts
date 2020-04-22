import { WebApiGetReactionsResponse } from '../api/api.types';
import { log, error, logErrorAndThrow } from '../../../util/log';
import { BASE_EMOJI, BOT_EMOJI } from '../../../config/constants';
import { createPairsFromArray } from '../../../util/util';
import { getIceBreaker } from '../utils/getIceBreaker';
import { getAllChannelIntegrations } from '../repository/coffee-repository';
import { getReactionsForMessage, openConversation, postMessageToChat } from '../api/slack';

const startConversationMessage = () => `:wave: Hello!
\n\nYou have been paired for an informal chat or conversation :speech_balloon:. Feel free to run this however you both feel most comfortable!
\n\nThe icebreaker :icecream: today is: ${getIceBreaker()}`;

const missedOutMessage = () => `:wave: Hello!
\n\nI'm really sorry but you were a bit too late today and just missed out on a match.
\n\nThe earlier you opt-in to the matching the better your chances of getting a match - so :crossed_fingers: for next time!`;

const dailyMatchCompleted = () => `The daily matching has completed for today. Enjoy your coffee breaks! :coffee:`;

export async function createPairConversations() {
  try {
    const channels = await getAllChannelIntegrations();

    if (channels) {
      const promises = channels.map(async (channel) => {
        try {
          const res = await getReactionsForMessage({
            channel: channel.channelId,
            timestamp: channel.latestPostTimestamp,
            full: true,
          });
          const pairs = createMatchingPairs(res);
          await initiateChats(pairs);
          await postMessageToChat({
            channel: channel.channelId,
            text: dailyMatchCompleted(),
            icon_emoji: BOT_EMOJI,
          });
        } catch (err) {
          error(err);
        }
      });

      Promise.all(promises)
        .then(() => {
          log('Success');
        })
        .catch(logErrorAndThrow);
    }
  } catch (err) {
    logErrorAndThrow(err);
  }
}

function createMatchingPairs(res: WebApiGetReactionsResponse) {
  if (res.message.reactions) {
    const usersWantingAChat = res.message.reactions
      .filter((reaction) => reaction.name.includes(BASE_EMOJI))
      .map((reaction) => reaction.users)
      .reduce((prev, next) => [...prev, ...next], []);

    const uniqueUsersWantingAChat = [...new Set(usersWantingAChat)];

    if (uniqueUsersWantingAChat.length > 0) {
      return createPairsFromArray(uniqueUsersWantingAChat);
    }
  }
  return [];
}

async function initiateChats(pairs: string[][]) {
  const promises = pairs.map((pair) => {
    const message = pair.length === 2 ? startConversationMessage() : missedOutMessage();
    return openConversation({ users: pair.join(',') }).then((openConversationResponse) =>
      postMessageToChat({
        channel: openConversationResponse.channel.id,
        text: message,
        icon_emoji: BOT_EMOJI,
      }),
    );
  });
  Promise.all(promises)
    .then(() => {
      log('Success');
    })
    .catch((err) => console.error(err));
}
