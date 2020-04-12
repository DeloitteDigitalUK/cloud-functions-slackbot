import { WebAPICallResult } from '@slack/web-api';

export interface WebApiGetReactionsResponse extends WebAPICallResult {
  message: {
    type: 'message';
    subtype: 'bot_message';
    text: string;
    ts: string;
    username: string;
    icons: {
      emoji: string;
      image_64: string;
    };
    bot_id: string;
    reactions: Reaction[];
    permalink: string;
  };
}

interface Reaction {
  name: string;
  users: string[];
  count: number;
}

export interface WebApiConversationResponse extends WebAPICallResult {
  channel: {
    id: string;
    name: string;
    is_channel: boolean;
    is_group: boolean;
    is_im: boolean;
    created: number;
    is_archived: boolean;
    is_general: boolean;
    unlinked: number;
    name_normalized: string;
    is_shared: boolean;
    parent_conversation: null;
    creator: string;
    is_ext_shared: boolean;
    is_org_shared: boolean;
    shared_team_ids: string[];
    pending_shared: [];
    pending_connected_team_ids: [];
    is_pending_ext_shared: boolean;
    is_member: boolean;
    is_private: boolean;
    is_mpim: boolean;
    last_read: string;
    is_open: boolean;
    topic: {
      value: string;
      creator: string;
      last_set: number;
    };
    purpose: {
      value: string;
      creator: string;
      last_set: number;
    };
    priority: number;
  };
}

export interface WebApiPostMessageResponse extends WebAPICallResult {
  message: {
    type: 'message';
    subtype: 'bot_message';
    text: string;
    ts: string;
    username: string;
    icons: {
      emoji: string;
      image_64: string;
    };
    bot_id: string;
  };
  channel: string;
  ts: string;
  ok: boolean;
}
