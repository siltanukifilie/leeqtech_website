# LeeqTech Website

A responsive professional company website covering Consulting, Training, AI Technology, Data Engineering, IT Solutions and Automation. Built with accessible HTML, CSS and JavaScript; a Supabase Edge Function handles enquiries once configured. No frontend dependencies or build tool downloads are required.

## Local preview

Requires Node.js 22 or later.

```
npm run dev
```

Open http://localhost:4173. Build with `npm run build`; publish the resulting `dist/` directory on your chosen static host. Run validation tests with `npm test`.

## Current state

- Website and Supabase integration source prepared locally.
- Original Lovable content was inaccessible. Copy is drafted from the six services supplied by the owner; confirm details before public launch.
- GitHub repository: https://github.com/siltanukifilie/leeqtech_website
- Supabase project `gbzjapigsmkzofjsibib` (LeeqTech) is active. The enquiries table and contact Edge Function are deployed.
- Pending: Cloudflare Turnstile site/secret keys and the Edge Function ALLOWED_ORIGIN setting. Contact submission remains disabled until these are configured.
- Contact submissions remain disabled until the configuration is complete. No submissions are saved locally or falsely reported as delivered.
- Google Fonts is optional; system fonts provide a fallback.

## Connect Supabase

1. Use the existing LeeqTech project: https://supabase.com/dashboard/project/gbzjapigsmkzofjsibib. Do not create a duplicate.
2. The `create_leeqtech_enquiries` migration is already applied; `supabase/schema.sql` records its schema. RLS is enabled and public read/write permissions are revoked. The informational no-policy advisor is intentional because only the server handler writes enquiries.
3. Configure Cloudflare Turnstile for the site's exact domain.
4. Set Edge Function secrets `ALLOWED_ORIGIN` (exact origin, without a trailing slash) and `TURNSTILE_SECRET_KEY`. Supabase provides the server-side `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` environment variables. Never add service credentials to the frontend or GitHub.
5. The `contact` function is already deployed with the supplied configuration. JWT checking is disabled only for this public endpoint; the handler validates the exact origin, Turnstile token and hostname, payload sizes and fields before storing data.
6. Set `contactEndpoint` in `public/config.js` to your project's `/functions/v1/contact` URL and `turnstileSiteKey` to your public site key. Rebuild and deploy the frontend.
7. Test valid and invalid submissions on the real domain. Confirm the database receives the valid enquiry, invalid requests are rejected, and anonymous clients cannot read enquiries. Run Supabase security advisors before launch.

Enquiries are visible to the owner through the Supabase Table Editor. This version does not send email notifications. Establish your retention policy and privacy contact before collecting enquiries. Turnstile provides abuse protection; consider additional server rate limits if traffic requires them.

## GitHub handoff

The source is maintained at https://github.com/siltanukifilie/leeqtech_website. Run locally with `npm run dev`. Supabase hosts the backend; a static website host serves the frontend.

## Cloudflare Workers static hosting

The existing Cloudflare project is named `leeqtech-website` and uses Workers Builds.
`wrangler.jsonc` tells its deploy command to publish the generated `dist/` directory.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: repository root (`/`)
- Production branch: `main`

Use a new build of the latest commit after configuration changes. The domain can be
connected through the Cloudflare project's Domains settings after deployment succeeds.
No database credentials belong in the Cloudflare build variables or static assets.
