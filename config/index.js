

module.exports = {
    mongoConfig: {
      HOSTNAME: "cluster0.go6w7.mongodb.net",
      SCHEMA: "mongodb+srv",
      USER: "app",
      PASSWORD: process.env.MONGO_PASSWORD,
      DATABASE: "chat",
      OPTIONS: "retryWrites=true&w=majority"
    },
    redisConfig: {
      PASSWORD: process.env.REDIS_PASSWORD
    },
    mail: {
      GMAIL_PWD: process.env.GMAIL_PWD,
      GMAIL_ADDRESS: process.env.GMAIL_ADDRESS
    },
    twilio: {
      TWILIO_AUTH: process.env.TWILIO_AUTH,
      TWILIO_SID: process.env.TWILIO_SID,
      TWILIO_PHONE: process.env.TWILIO_PHONE
    }
  }