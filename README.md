# Portfolio API (oluferanmi-sec.me backend)

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in real values.
3. Generate your admin password hash:
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('your-real-password', 10))"
   ```
   Paste the output into `ADMIN_PASSWORD_HASH` in `.env`.
4. `npm run dev` for local dev (auto-restarts on file changes).

## Endpoints

- `GET /api/projects` / `GET /api/certifications` / `GET /api/skills` — public read
- `POST /api/contact` — public contact form submission (rate-limited, honeypot spam check)
- `POST /api/auth/login` — admin login, returns a JWT
- `GET/POST/PUT/DELETE /api/admin/{projects,certifications,skills}` — admin CRUD (Bearer token required)
- `GET/PATCH/DELETE /api/admin/messages` — inbox

## Notes

- Resend's default `onboarding@resend.dev` sender works out of the box for testing.
  Once you verify a domain in Resend, swap the `from` address in `src/utils/mail.js`.
- Deployed as its own Render Web Service — see the deployment walkthrough in the main reply.
