export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
}); 