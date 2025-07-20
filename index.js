require('dotenv').config(); // Load variables from .env file

const axios = require('axios');

// Destructure environment variables
const {
  CALLMEBOT_API_KEY,
  CALLMEBOT_PHONE_NUMBER,
  API_URL
} = process.env;

async function run() {
  try {
    const { data: response } = await axios.get(API_URL);

    const title = response?.pageProps?.data?.pageTitle;

    if (!title) {
      console.error("pageTitle not found in API response");
      return;
    }

    const match = title.match(/\d+/);
    const sentimentMatch = title.match(/\(([^)]+)\)/);

    if (match && sentimentMatch) {
      const score = parseInt(match[0], 10);
      const sentiment = sentimentMatch[1];

      const message = `🧠 Crypto Fear & Greed Index: ${score} (${sentiment})`;

      console.log("Sending WhatsApp message:", message);

      try {
        const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE_NUMBER}&text=${encodeURIComponent(message)}&apikey=${CALLMEBOT_API_KEY}`;
        
        const messageResponse = await axios.get(callMeBotUrl);

        if (messageResponse.data === "OK") {
          console.log("✅ Message sent successfully!");
        } else {
          console.log("⚠️ Message response:", messageResponse.data);
        }
      } catch (messageError) {
        console.error("❌ Failed to send WhatsApp message:", messageError.message);
        throw messageError; // Re-throw to be caught by outer catch block
      }

    } else {
      console.error("Could not extract score or sentiment from title");
    }
  } catch (error) {
    console.error("Failed to fetch or send message:", error.message);
  }
}

run();
