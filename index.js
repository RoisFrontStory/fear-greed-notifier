const axios = require('axios');
const twilio = require('twilio');

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM,
  TWILIO_WHATSAPP_TO,
  API_URL
} = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function run() {
  try {
    const { data: response } = await axios.get(API_URL);
    const title = response?.pageProps?.data?.pageTitle;

    if (!title) {
      console.log("pageTitle not found.");
      return;
    }

    const match = title.match(/\d+/);
    const sentimentMatch = title.match(/\(([^)]+)\)/);

    if (match && sentimentMatch) {
      const score = parseInt(match[0], 10);
      const sentiment = sentimentMatch[1];

      const message = `🧠 Crypto Fear & Greed Index: ${score} (${sentiment})`;

      console.log("Sending WhatsApp message:", message);

      await client.messages.create({
        body: message,
        from: TWILIO_WHATSAPP_FROM,
        to: TWILIO_WHATSAPP_TO
      });
    } else {
      console.log("Could not extract score or sentiment.");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
