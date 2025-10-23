const app = require('./app');

const PORT = process.env.PORT || 5000;
// Always bind to 0.0.0.0 for cloud deployments (Render, Heroku, etc.)
// In local development, 0.0.0.0 still allows localhost access
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 Listening on ${HOST}:${PORT}`);
  console.log(`📡 Access at: http://localhost:${PORT} (local) or your domain (production)`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});
