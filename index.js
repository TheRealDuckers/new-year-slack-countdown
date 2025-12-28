import fetch from "node-fetch";
import http from "http";

const SLACK_TOKEN = process.env.SLACK_TOKEN;
const STATUS_EMOJI = ":tada:";

// --- countdown logic ---
async function setSlackStatus(text, emoji) {
  await fetch("https://slack.com/api/users.profile.set", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SLACK_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      profile: {
        status_text: text,
        status_emoji: emoji,
        status_expiration: 0
      }
    })
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
  return `${days}d ${hours}h ${minutes}m until New Year!`;
}

async function updateStatus() {
  const remaining = getTimeUntilNewYear();
  const statusText = formatCountdown(remaining);
  await setSlackStatus(statusText, STATUS_EMOJI);
  console.log("Updated status:", statusText);
}

// run immediately + every minute
updateStatus();
setInterval(updateStatus, 60_000);

// --- tiny web server so Render stays alive ---
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Countdown service running");
}).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
