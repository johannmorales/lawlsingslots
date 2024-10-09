"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToKickChat = void 0;
exports.addCommandListener = addCommandListener;
exports.kickSendMessage = kickSendMessage;
exports.kickSendReply = kickSendReply;
exports.kickChatBan = kickChatBan;
exports.kickIsOnline = kickIsOnline;
exports.unmod = unmod;
exports.getKickProfileForChannel = getKickProfileForChannel;
exports.getKickChannel = getKickChannel;
exports.getKickIsUserSub = getKickIsUserSub;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const stream_1 = require("stream");
const url_1 = require("url");
const ws_1 = require("ws");
const http_1 = require("./http");
const getChatroomId = async (channel) => {
    const puppeteerExtra = puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
    const browser = await puppeteerExtra.launch({ headless: 'shell' });
    const page = await browser.newPage();
    await page.goto(`https://kick.com/api/v2/channels/${channel}`);
    await page.waitForSelector('body');
    const jsonContent = await page.evaluate(() => {
        const bodyElement = document.querySelector('body');
        const bodyText = bodyElement ? bodyElement.textContent : null;
        return bodyText ? JSON.parse(bodyText) : null;
    });
    await browser.close();
    return await jsonContent.chatroom.id;
};
const subscribeToKickChat = async (channel) => {
    const eventEmitter = new stream_1.EventEmitter();
    const chatroomId = await getChatroomId(channel);
    const baseUrl = 'wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679';
    const urlParams = new url_1.URLSearchParams({
        protocol: '7',
        client: 'js',
        version: '7.4.0',
        flash: 'false',
    });
    const url = `${baseUrl}?${urlParams.toString()}`;
    const socket = new ws_1.WebSocket(url);
    socket.on('open', async () => {
        const connect = JSON.stringify({
            event: 'pusher:subscribe',
            data: { auth: '', channel: `chatrooms.${chatroomId}.v2` },
        });
        socket.send(connect);
    });
    socket.on('message', data => {
        try {
            const messageEvent = data.toString();
            const parsed = JSON.parse(messageEvent);
            if (!parsed.event.endsWith('ChatMessageEvent'))
                return;
            const parsedData = JSON.parse(parsed.data);
            const badges = parsedData.sender.identity.badges;
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
        }
        catch (er) { }
    });
    return eventEmitter;
};
exports.subscribeToKickChat = subscribeToKickChat;
function addCommandListener(emitter, command, cooldown, handler, channelId, authorizationToken) {
    const history = new Map();
    emitter.on('message', async (message) => {
        var _a;
        const content = message.content.trim();
        if (!content.startsWith(`!${command}`))
            return;
        const senderId = message.sender.id;
        if (history.has(senderId) &&
            Date.now() - history.get(senderId) < cooldown * 1000)
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
        }
        catch (error) {
            if (error instanceof Error && channelId && authorizationToken) {
                await kickSendReply(channelId, authorizationToken, message, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : 'yonose');
            }
        }
    });
}
async function kickSendMessage(channelId, authorizationToken, message) {
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
async function kickSendReply(channelId, authorizationToken, originalMessage, content) {
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
async function kickChatBan(authorizationToken, channel, username, duration) {
    const body = {
        banned_username: username,
        duration: duration !== null && duration !== void 0 ? duration : 0,
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
async function kickIsOnline(channelId) {
    var _a;
    try {
        const response = await (0, http_1.http)(`https://kick.com/current-viewers?ids[]=${channelId}`, {}, (0, http_1.cacheKey)('kickIsOnline', channelId), 1000 * 30);
        return !!((_a = response === null || response === void 0 ? void 0 : response[0]) === null || _a === void 0 ? void 0 : _a.viewers);
    }
    catch (error) {
        return false;
    }
}
async function unmod(authorizationToken, channel, mod) {
    await fetch(`https://kick.com/api/internal/v1/channels/${channel}/community/moderators/${mod}`, {
        headers: {
            accept: 'application/json',
            'accept-language': 'en-US,en;q=0.9',
            authorization: authorizationToken,
            'cache-control': 'max-age=0',
            cluster: 'v1',
            priority: 'u=1, i',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-arch': '"x86"',
            'sec-ch-ua-bitness': '"64"',
            'sec-ch-ua-full-version': '"129.0.6668.70"',
            'sec-ch-ua-full-version-list': '"Google Chrome";v="129.0.6668.70", "Not=A?Brand";v="8.0.0.0", "Chromium";v="129.0.6668.70"',
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
    });
}
async function getKickProfileForChannel(channel, username) {
    const response = await (0, http_1.http)(`https://kick.com/api/v2/channels/${channel}/users/${username}`, {
        method: 'GET',
    }, (0, http_1.cacheKey)('getKickProfileForChannel', channel, username));
    return response;
}
async function getKickChannel(channel) {
    const response = await (0, http_1.http)(`https://kick.com/api/v2/channels/${channel}`, {
        method: 'GET',
    });
    if (!(response === null || response === void 0 ? void 0 : response.id)) {
        return null;
    }
    return response;
}
async function getKickIsUserSub(channel, username) {
    var _a;
    const profile = await getKickProfileForChannel(channel, username);
    return !!((_a = profile.badges) === null || _a === void 0 ? void 0 : _a.some((badge) => badge.type === 'subscriber'));
}
//# sourceMappingURL=index.js.map