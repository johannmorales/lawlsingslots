import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import {EventEmitter} from 'stream';
import {URLSearchParams} from 'url';
import {WebSocket} from 'ws';
import {cacheKey, http} from './http';
import {KickChannelUserProfile, Message} from 'stream-types';

const getChatroomId = async (channel: string) => {
  const puppeteerExtra = puppeteer.use(StealthPlugin());
  const browser = await puppeteerExtra.launch({headless: 'shell'});
  const page = await browser.newPage();
  await page.goto(`https://kick.com/api/v2/channels/${channel}`);
  await page.waitForSelector('body');
  const jsonContent = await page.evaluate(() => {
    const bodyElement = document!.querySelector('body');
    const bodyText = bodyElement ? bodyElement.textContent : null;
    return bodyText ? JSON.parse(bodyText) : null;
  });
  await browser.close();
  return await jsonContent.chatroom.id;
};

export const subscribeToKickChat = async (channel: string) => {
  const eventEmitter = new EventEmitter<{message: Message[]}>();
  const chatroomId = await getChatroomId(channel);
  const baseUrl = 'wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679';
  const urlParams = new URLSearchParams({
    protocol: '7',
    client: 'js',
    version: '7.4.0',
    flash: 'false',
  });
  const url = `${baseUrl}?${urlParams.toString()}`;

  const socket = new WebSocket(url);
  socket.on('open', async () => {
    const connect = JSON.stringify({
      event: 'pusher:subscribe',
      data: {auth: '', channel: `chatrooms.${chatroomId}.v2`},
    });
    socket.send(connect);
  });
  socket.on('message', data => {
    try {
      const messageEvent = data.toString();
      const parsed = JSON.parse(messageEvent);
      if (!parsed.event.endsWith('ChatMessageEvent')) return;
      const parsedData = JSON.parse(parsed.data);
      const badges: Message['sender']['identity']['badges'] =
        parsedData.sender.identity.badges;
      eventEmitter.emit('message', {
        id: parsedData.id,
        content: parsedData.content,
        createdAt: parsedData.created_at,
        sender: {
          id: parsedData.sender.id,
          isModerator: badges.some(badge => badge.type === 'moderator'),
          isSub: badges.some(badge => badge.type === 'subscriber'),
          isBroadcaster: badges.some(badge => badge.type === 'broadcaster'),
          username: parsedData.sender.username,
          identity: {
            color: parsedData.sender.identity.color,
            badges,
          },
        },
      });
    } catch (er) {}
  });

  return eventEmitter;
};

export type CommandHandler = (props: {
  message: Message;
  args: string[];
}) => Promise<void>;

export function addCommandListener(
  emitter: EventEmitter<{message: Message[]}>,
  command: string,
  cooldown: number,
  handler: CommandHandler,
  channelId?: string,
  authorizationToken?: string
) {
  const history = new Map<number, number>();
  emitter.on('message', async message => {
    const content = message.content.trim();
    if (!content.startsWith(`!${command}`)) return;
    const senderId = message.sender.id;
    if (
      history.has(senderId) &&
      Date.now() - history.get(senderId)! < cooldown * 1000
    )
      return;
    history.set(senderId, new Date().getTime());
    try {
      await handler({
        message,
        args: content
          .split(' ')
          .map(arg => arg.trim())
          .slice(1),
      });
    } catch (error) {
      if (error instanceof Error && channelId && authorizationToken) {
        await kickSendReply(
          channelId,
          authorizationToken,
          message,
          error?.message ?? 'yonose'
        );
      }
    }
  });
}

export async function kickSendMessage(
  channelId: string,
  authorizationToken: string,
  message: string
) {
  await fetch(`https://kick.com/api/v2/messages/send/${channelId}`, {
    headers: {
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      authorization: authorizationToken,
      'cache-control': 'max-age=0',
      cluster: 'v1',
      'content-type': 'application/json',
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: `{"content":"${message}","type":"message"}`,
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  });
}

export async function kickSendReply(
  channelId: string,
  authorizationToken: string,
  originalMessage: Message,
  content: string
) {
  const body = {
    content,
    type: 'reply',
    metadata: {
      original_message: {
        id: originalMessage.id,
        content: originalMessage.content,
      },
      original_sender: {
        id: originalMessage.sender.id,
        username: originalMessage.sender.username,
      },
    },
  };
  await fetch(`https://kick.com/api/v2/messages/send/${channelId}`, {
    headers: {
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      authorization: authorizationToken,
      'cache-control': 'max-age=0',
      cluster: 'v1',
      'content-type': 'application/json',
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: JSON.stringify(body),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  });
}

export async function kickChatBan(
  authorizationToken: string,
  channel: string,
  username: string,
  duration?: number
) {
  const body = {
    banned_username: username,
    duration: duration ?? 0,
    permanent: duration === undefined,
  };
  await fetch(`https://kick.com/api/v2/channels/${channel}/bans`, {
    headers: {
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      authorization: authorizationToken,
      'cache-control': 'max-age=0',
      cluster: 'v1',
      'content-type': 'application/json',
      priority: 'u=1, i',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: JSON.stringify(body),
    method: 'POST',
  });
}

export async function kickIsOnline(channelId: string): Promise<boolean> {
  try {
    const response = await http(
      `https://kick.com/current-viewers?ids[]=${channelId}`,
      {},
      cacheKey('kickIsOnline', channelId),
      1000 * 30
    );
    return !!response?.[0]?.viewers;
  } catch (error) {
    return false;
  }
}

export async function unmod(
  authorizationToken: string,
  channel: string,
  mod: string
) {
  await fetch(
    `https://kick.com/api/internal/v1/channels/${channel}/community/moderators/${mod}`,
    {
      headers: {
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9',
        authorization: authorizationToken,
        'cache-control': 'max-age=0',
        cluster: 'v1',
        priority: 'u=1, i',
        'sec-ch-ua':
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        'sec-ch-ua-arch': '"x86"',
        'sec-ch-ua-bitness': '"64"',
        'sec-ch-ua-full-version': '"129.0.6668.70"',
        'sec-ch-ua-full-version-list':
          '"Google Chrome";v="129.0.6668.70", "Not=A?Brand";v="8.0.0.0", "Chromium";v="129.0.6668.70"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-model': '""',
        'sec-ch-ua-platform': '"Windows"',
        'sec-ch-ua-platform-version': '"10.0.0"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: null,
      method: 'DELETE',
    }
  );
}

export async function getKickProfileForChannel(
  channel: string,
  username: string
) {
  const response = await http(
    `https://kick.com/api/v2/channels/${channel}/users/${username}`,
    {
      method: 'GET',
    },
    cacheKey('getKickProfileForChannel', channel, username)
  );

  return response;
}

export async function getKickChannel(channel: string) {
  const response: KickChannelUserProfile = await http(
    `https://kick.com/api/v2/channels/${channel}`,
    {
      method: 'GET',
    }
  );

  if (!response?.id) {
    return null;
  }

  return response;
}

export async function getKickIsUserSub(channel: string, username: string) {
  const profile = await getKickProfileForChannel(channel, username);
  return !!profile.badges?.some((badge: any) => badge.type === 'subscriber');
}
