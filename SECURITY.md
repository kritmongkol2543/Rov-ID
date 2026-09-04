# Secret handling

This storefront must never place secret credentials in browser-delivered HTML, CSS, JavaScript, `NEXT_PUBLIC_*`, or `VITE_*` variables.

## Server-only variables
- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYMENT_WEBHOOK_SECRET`
- `PAYMENT_PROVIDER_SECRET_KEY`
- `LINE_CHANNEL_ACCESS_TOKEN`
- `ADMIN_SESSION_SECRET`
- `JWT_SECRET`

Configure these in Vercel Project Settings > Environment Variables for the required environments. Browser code should call server routes such as `/api/order`, `/api/payment`, and `/api/admin/*`; only those server routes may read secrets.

## Important limitation
Environment variables protect credentials, not frontend source code. Any HTML/CSS/JS sent to the browser can still be inspected or copied. Repository privacy and deployment access control are separate controls and remain recommended for client review.
