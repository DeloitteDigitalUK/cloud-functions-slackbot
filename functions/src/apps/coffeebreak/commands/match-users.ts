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

export async function createPairConversations() {
  try {
    const channels = await getAllChannelIntegrations();

    if (channels) {
      const promises = channels.map(async (channel) => {
        try {
          const res = await getReactionsForMessage({
            channel: channel.channelId,
            timestamp: channel.latestPostTimestamp,
          });
          const { pairs } = await initiateChats(res);
          // Save?
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

async function initiateChats(res: WebApiGetReactionsResponse) {
  if (res.message.reactions) {
    const raisedHandsReactions = res.message.reactions.find((reaction) => reaction.name === BASE_EMOJI);
    if (raisedHandsReactions) {
      const pairs = createPairsFromArray([...raisedHandsReactions.users, 'U010YPFQWGN']);
      const promises = pairs.map((twoUsers) =>
        openConversation({ users: twoUsers.join(',') }).then((openConversationResponse) =>
          postMessageToChat({
            channel: openConversationResponse.channel.id,
            text: startConversationMessage(),
            icon_emoji: BOT_EMOJI,
          }),
        ),
      );
      Promise.all(promises)
        .then(() => {
          log('Success');
        })
        .catch((err) => console.error(err));
      return { pairs };
    } else {
      return { pairs: [] };
    }
  } else {
    return { pairs: [] };
  }
}
