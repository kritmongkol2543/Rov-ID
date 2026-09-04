module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ok: true,
    environment: process.env.VERCEL_ENV || 'local',
    build: process.env.PREVIEW_BUILD_LABEL || 'unset',
    integrations: {
      supabaseServer: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      paymentServer: Boolean(process.env.PAYMENT_PROVIDER_SECRET_KEY),
      lineServer: Boolean(process.env.LINE_CHANNEL_ACCESS_TOKEN)
    }
  });
};
