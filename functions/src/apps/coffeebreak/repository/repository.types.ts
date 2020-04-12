export type CoffeeBreakChannel = {
  id?: string;
  teamId: string;
  teamDomain: string;
  channelId: string;
  channelName: string;
  createdById: string;
  createdByUserName: string;
  createdTimestamp?: FirebaseFirestore.FieldValue;
  latestPostTimestamp?: string;
};
