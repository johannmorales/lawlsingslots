export type KickUserId = number;
export type Url = string;
export type KickTimestamp = string;
export type KickUserBadge = {
  type: 'sub_gifter' | 'broadcaster' | 'subscriber' | 'founder' | 'moderator';
  text: string;
  count?: number;
  active: boolean;
};
export type KickChannelUserProfile = {
  id: KickUserId;
  username: string;
  slug: string;
  profile_pic: string | null;
  is_staff: boolean;
  is_channel_owner: boolean;
  is_moderator: boolean;
  badges: KickUserBadge[];
  following_since: KickTimestamp;
  subscribed_for: number;
  banned: null;
};
export type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    isModerator: boolean;
    isSub: boolean;
    isBroadcaster: boolean;
    id: KickUserId;
    username: string;
    identity: {
      color: string;
      badges: {
        type:
          | 'sub_gifter'
          | 'broadcaster'
          | 'subscriber'
          | 'founder'
          | 'moderator';
        text: string;
        count?: number;
      }[];
    };
  };
};
export type Slot = {
  id: string;
  name: string;
  thumbnail: Url;
  background?: Url;
  provider: string;
  url: Url;
};
export type Call = {
  messageId: Message['id'];
  sender: Message['sender'];
  slot: Slot;
};
