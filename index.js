import fetch from "node-fetch";

const SLACK_TOKEN = process.env.SLACK_TOKEN;
const STATUS_EMOJI = ":tada:";

async function setSlackStatus(text, emoji) {
  const url = "https://slack.com/api/users.profile.set";

  const payload = {
    profile: {
      status_text: text,
      status_emoji: emoji,
      status_expiration: 0
    }
  };

  await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SLACK_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

function getTimeUntilNewYear() {
  const now = new Date();
  const nextYear = now.getFullYear() + 1;
  const newYear = new Date(nextYear, 0, 1, 0, 0, 0);
  return newYear - now;
}

function formatCountdown(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s until New Year`;
}

async function updateStatus() {
  const remaining = getTimeUntilNewYear();
  const statusText = formatCountdown(remaining);

  await setSlackStatus(statusText, STATUS_EMOJI);
  console.log("Updated status:", statusText);
}

// Update immediately, then every minute
updateStatus();
setInterval(updateStatus, 60_000);
