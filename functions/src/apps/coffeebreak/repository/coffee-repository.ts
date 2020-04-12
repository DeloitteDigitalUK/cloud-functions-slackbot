import { db, firestoreTimestamp } from '../../../config/env';
import { CoffeeBreakChannel } from './repository.types';
import { CHANNELS_COLLECTION } from '../../../config/constants';
import { logErrorAndThrow } from '../../../util/log';
import { as } from '../../../util/type.utils';

export async function addChannelIntegration(channel: CoffeeBreakChannel) {
  const ref = db.collection(CHANNELS_COLLECTION).doc();
  const { id } = ref;
  const channelDocument: CoffeeBreakChannel = {
    ...channel,
    id,
    createdTimestamp: firestoreTimestamp(),
  };
  return await ref.set(channelDocument).catch(logErrorAndThrow);
}

export async function removeChannelIntegration(channel: { teamId: string; channelId: string }) {
  const batch = db.batch();
  return db
    .collection(CHANNELS_COLLECTION)
    .where('channelId', '==', channel.channelId)
    .where('teamId', '==', channel.teamId)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => batch.delete(doc.ref));
      return batch.commit();
    })
    .catch(logErrorAndThrow);
}

export async function isChannelAlreadyIntegrated(channelId: string, teamId: string) {
  return db
    .collection(CHANNELS_COLLECTION)
    .where('channelId', '==', channelId)
    .where('teamId', '==', teamId)
    .get()
    .then((snapshot) => !snapshot.empty)
    .catch(logErrorAndThrow);
}

export async function getAllChannelIntegrations() {
  return db
    .collection(CHANNELS_COLLECTION)
    .get()
    .then((snapshot) => snapshot.docs.map((doc) => as<CoffeeBreakChannel>(doc.data())))
    .catch(logErrorAndThrow);
}

export async function updateChannelWithTimestamp(channelId: string, timestamp: string) {
  return db
    .collection(CHANNELS_COLLECTION)
    .where('channelId', '==', channelId)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => doc.ref.set({ latestPostTimestamp: timestamp }, { merge: true }));
    })
    .catch(logErrorAndThrow);
}
