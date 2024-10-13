import { writeFileSync } from "fs";
import { createStreamLogger } from "stream-logger";

const MAX_PAGES = 50;

const logger = createStreamLogger("slots-update");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fetchPage = async (page: number) => {
  const response = await fetch(
    "https://gamdom.com/client-api/casino/games-list",
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        baggage:
          "sentry-environment=production,sentry-release=51c805d1ecd859961e250d55a7b1a611a95e06f4,sentry-public_key=807c19c886e5bfbf697481b7108e7d2b,sentry-trace_id=58726fe654c34736b37e3cbe47e08fef,sentry-sample_rate=0.2,sentry-sampled=true",
        "content-type": "application/json",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sentry-trace": "3edc55f7012c4036be1f3d424c18fb97-a0aa93052f4a88a3-1",
        traceparent: "00-27ff613b4d5ab617842651d41b8c9841-c8e5e08a2593e18a-01",
        tracestate:
          "4111936@nr=0-1-4111936-538502777-c8e5e08a2593e18a----1725412370128",
        Referer: "https://gamdom.com/casino?tab=slots",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: `{\"config\":[{\"sectionType\":\"slots\",\"limit\":100,\"page\":${page}}]}`,
      method: "POST",
    },
  );
  const json = (await response.json()) as any;
  return json?.games?.[0].gamesList;
};

const main = async () => {
  const slots: any[] = [];
  for (let i = 0; i < MAX_PAGES; i++) {
    const toAdd = await fetchPage(i);
    slots.push(...toAdd);
    logger.info({
      message: `Done fetching page ${i}. Added ${toAdd.length} records`,
    });
    if (toAdd.length === 0) break;
    await sleep(500);
  }
  const slotsTrimmed = slots.map((slot) => ({
    id: slot.game_code,
    name: slot.name,
    thumbnail: slot.url_thumb.startsWith("/")
      ? `https://gamdom.com${slot.url_thumb}`
      : slot.url_thumb,
    background: slot.url_background,
    provider: slot.provider_name,
    url: `https://gamdom.com/casino/${encodeURIComponent(slot.name)}_${encodeURIComponent(slot.provider_name)}`,
  }));
  writeFileSync(
    "./src/data/slots_data.json",
    JSON.stringify({ slots }, null, 2),
  );
  writeFileSync(
    "./src/data/slots_data_trimmed.json",
    JSON.stringify({ slots: slotsTrimmed }, null, 2),
  );
};

main();
