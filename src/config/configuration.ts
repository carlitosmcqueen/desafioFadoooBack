export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
}); 