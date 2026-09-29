# Email-only patient information form

A static patient form published on GitHub Pages. A single Netlify serverless function forwards each submission to the clinic through Resend. The application does not create a database, submission history, dashboard, or patient accounts.

## Project map

- `frontend/` — patient form, logo, styling, and editable question definition; published with GitHub Pages.
- `netlify/functions/submit.mjs` — validates each submission and sends the email through Resend. It does not save the request.
- `netlify/functions/submission-pdf.mjs` — formats the submitted answers into a downloadable PDF attachment.
- `package.json` — declares the PDF generation dependency used by the Netlify function.
- `netlify.toml` — tells Netlify where the email function and its small static service page are.
- `.github/workflows/pages.yml` — publishes `frontend/` to GitHub Pages.

## How the submission works

Patient browser → Netlify function → Resend → clinic mailbox. The email includes a short notice and a PDF attachment with the patient information, all submitted answers, date/time, and submission reference. On successful email API acceptance, the form shows a confirmation. If sending fails, the page keeps the patient's answers and offers a retry. No response data is put in a URL, GitHub, or Netlify function logs.

Email itself creates copies: the clinic mailbox receives it, and Resend processes the PDF and submission content and retains email content and delivery logs for 30 days on its Free plan. The app does not keep a separate database copy. See [Resend's retention policy](https://resend.com/security/gdpr). Confirm the clinic is permitted to use this email workflow for health information before collecting real patient data.

## Put the Resend key and clinic email here

1. Connect this project repository to Netlify as a new site. Keep its base directory at the repository root so it reads `netlify.toml` and `netlify/functions/`.
2. In the Netlify site, open **Project configuration → Environment variables** and add:
   - `RESEND_API_KEY` — paste the key from Resend. Keep it in Netlify only; never put it in `frontend/`, GitHub files, or a GitHub Pages setting.
   - `CLINIC_EMAIL` — the inbox or comma-separated inboxes that should receive submissions.
   - `RESEND_FROM` — a sender address on a domain verified in Resend, e.g. `Dietitian Clinic <forms@clinic.example>`.
   - `ALLOWED_ORIGIN` — the exact GitHub Pages site origin, e.g. `https://account.github.io` (no trailing slash and no project path).
3. Save the variables, then trigger a Netlify deploy so the function picks them up.
4. In `frontend/config.js`, replace the placeholder `apiBaseUrl` with the Netlify function URL shown by your site: `https://YOUR-SITE.netlify.app/.netlify/functions/submit`.
5. Push the project root to GitHub. In GitHub, select **Settings → Pages → GitHub Actions**. The included workflow publishes the `frontend/` folder on pushes to `main`.
6. Use only sample, non-sensitive information to check the live flow before sharing it with patients.

Resend's `resend.dev` testing sender can send only to the email address used to sign in to Resend. Sending to other clinic inboxes requires a sender address on a verified domain. The message delivered by this project includes the complete form as a PDF attachment.

Netlify's Free plan currently includes 300 monthly credits and has a hard cap: when used up, the site pauses until the next month rather than charging overages. Keep automatic paid upgrades or add-on credits disabled if you want to avoid charges. See [Netlify pricing](https://www.netlify.com/pricing/). GitHub Pages is available on GitHub Free for public repositories; the public repository contains code only, never submissions or keys. See [GitHub Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages).

## Local preview

From the repository root, serve the frontend with `python -m http.server 8000 --directory frontend`. For local function development, use Netlify CLI (`netlify dev`) and an untracked local `.env`/Netlify environment configuration for secrets. Never commit local secret files. Before production, set `ALLOWED_ORIGIN` to the exact GitHub Pages origin.

## Change the clinic details and questions

- Clinic name and Netlify endpoint: `frontend/config.js`.
- Form questions, types, choices, and required flags: `frontend/form-definition.js`. The date field is prefilled with the patient's local current date.
- Logo image: replace `frontend/assets/clinic-logo.jpg`.
- Email notification and attachment name: `netlify/functions/submit.mjs`.
- PDF layout and colors: `netlify/functions/submission-pdf.mjs`.
- The notification recipient is the Netlify `CLINIC_EMAIL` environment variable.

`RESEND_API_KEY` and `CLINIC_EMAIL` are read by the server-side function only. They must never be added to the frontend configuration or repository.


