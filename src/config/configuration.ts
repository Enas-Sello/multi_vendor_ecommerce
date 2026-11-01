export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  database: {
    uri: process.env.MONGODB_URI,
  },
  auth: {
    jwtSecret:
      process.env.JWT_SECRET ??
      'development-only-change-this-secret-before-deploying',
  },
});
