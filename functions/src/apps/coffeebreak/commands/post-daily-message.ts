import { log, error, logErrorAndThrow } from '../../../util/log';
import { BOT_EMOJI, BASE_EMOJI } from '../../../config/constants';
import { getAllChannelIntegrations, updateChannelWithTimestamp } from '../repository/coffee-repository';
import { postMessageToChat } from '../api/slack';

const dailyMessage = `Good morning!\n\nMe again with the daily roundup. Would you like to participate in today’s *coffee roulette*?\n\nRespond with a :${BASE_EMOJI}: if yes!`;

/**
 * Flow -> get all channels available - post message to each of them
 * Try catch for each channel
 * @param web WebClient
 */
export async function postDailyMessage() {
  try {
    const channels = await getAllChannelIntegrations();

    if (channels) {
      const promises = channels.map(async (channel) => {
        try {
          const res = await postMessageToChat({
            channel: channel.channelId,
            text: dailyMessage,
            icon_emoji: BOT_EMOJI,
          });
          await updateChannelWithTimestamp(res.channel, res.message.ts);
        } catch (err) {
          error(err);
        }
      });

      Promise.all(promises)
        .then(() => {
          log('Success');
        })
        .catch(logErrorAndThrow);
    } else {
      log('No channels integrated yet');
    }
    return;
  } catch (err) {
    logErrorAndThrow(err);
  }
}
