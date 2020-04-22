import { log, error, logErrorAndThrow } from '../../../util/log';
import { BOT_EMOJI, BASE_EMOJI_SKIN_TONES, BOT_NAME } from '../../../config/constants';
import { getAllChannelIntegrations, updateChannelWithTimestamp } from '../repository/coffee-repository';
import { postMessageToChat } from '../api/slack';

const dailyMessage = `Good morning! :sunny: 
\n\nEvery morning, with ${BOT_NAME}, you can opt in to being randomly paired with someone for an informal coffee :coffee: and a chat. When matched, ${BOT_NAME} will start a Slack conversation for your pair and provide an optional icebreaker to start. You may then run your coffee break however you feel most comfortable.
\n\nWould you like to participate in today’s *coffee matching*?
\n\nReact to this post with any of  ${BASE_EMOJI_SKIN_TONES.join(' ')}  (raised_hands) if you would like to take part!`;

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
          await updateChannelWithTimestamp(channel.channelId, res.message.ts);
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
