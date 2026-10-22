# CORAL — Community Rescue and Alert Link

A responsive React/Vite research-demo website for community announcements in Corcuera, Romblon.

## Publish this project on GitHub Pages

These instructions use the repository name `coral-community-alert-link`. The included `vite.config.js` and GitHub Actions workflow are configured for that exact name.

1. Sign in at [GitHub](https://github.com/).
2. Create a **public** repository named `coral-community-alert-link`. Do not initialize it with a README if you plan to upload these project files with the browser upload option.
3. Extract the ZIP and open the `coral-website` folder. Upload the **contents** of that folder to the root of the new repository, including the hidden `.github` folder. If the `.github` folder is not visible in your file picker, enable hidden-file display or use Git locally.
4. Commit the files to the `main` branch.
5. In the repository, open **Settings → Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions**.
6. Open the **Actions** tab. The workflow named **Deploy CORAL to GitHub Pages** should run automatically after you push to `main`. Open the run and wait for both the build and deploy jobs to finish successfully.
7. Return to **Settings → Pages**. GitHub will show the published site URL. With the recommended repository name, it should be `https://YOUR-GITHUB-USERNAME.github.io/coral-community-alert-link/`.

### If you use a different repository name

Edit `vite.config.js` and change `/coral-community-alert-link/` to `/<YOUR-REPOSITORY-NAME>/`, keeping the leading and trailing slashes. Commit the change and let the workflow deploy again.

## Run locally

1. Install Node.js (LTS) from [nodejs.org](https://nodejs.org/).
2. Open a terminal in this project folder.
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the local URL printed by Vite (usually `http://localhost:5173`).

To create a production build locally, run `npm run build`; Vite writes the output to `dist/`.

## Included in this prototype

- Responsive homepage and category pages for power interruptions, sea travel, and disaster advisories.
- Announcement detail view with source, status, validity, and timestamps.
- Search and status filtering.
- Demo administrator sign-in and dashboard.
- Create, edit, draft, publish, archive, and restore announcements.
- In-app notifications with read/unread state and history.
- Text-size, high-contrast, and reduced-motion settings.
- Local browser persistence using `localStorage`.
- Explicit demo-data warnings and source disclaimers.
- GitHub Actions workflow for building and deploying to GitHub Pages.

## Important limitations

This is a front-end research prototype. Data is stored in the current browser via `localStorage` and is not shared between users or devices. The demo administrator gate accepts any non-empty username and password; it is **not secure authentication**. It does not send browser push notifications, fetch live advisories, or connect to an official source. Do not use the sample announcements as real community information.

GitHub Pages hosts static files only. Before using CORAL as a real community service, add a suitable backend/database, secure authentication and authorization, server-side validation, and a configured push-notification provider if push alerts are required. Verify every advisory with an authorized source.

## Research demonstration flow

1. Open the homepage and review the demo-data banner.
2. Visit each of the three information categories.
3. Open an announcement to inspect its source and timestamps.
4. Open Administrator login; enter any non-empty username/password for demo access.
5. Create and publish a clearly labelled demo announcement.
6. Verify it appears in the public category page and notification history.
7. Edit, archive, and restore an announcement.
8. Test accessibility settings and responsive layouts.

## Manual test checklist

- [ ] Homepage and category navigation work.
- [ ] Search and status filters work.
- [ ] Announcement details show source and timestamps.
- [ ] Required fields prevent publishing incomplete announcements.
- [ ] Create, edit, draft, publish, archive, and restore actions work.
- [ ] New publication/update generates an in-app notification.
- [ ] Notifications can be marked read and show history.
- [ ] Accessibility settings visibly affect the page.
- [ ] Data remains after browser refresh on the same browser.
- [ ] Mobile layout and keyboard focus are checked.
- [ ] Demo content is not mistaken for verified information.

Record actual test results after testing; do not mark untested features as passed.
