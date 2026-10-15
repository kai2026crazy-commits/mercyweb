# EnderVerse Minecraft Website

A responsive black + purple neon Minecraft community website template.

## Included
- Responsive layout and scroll animations
- Download cards (sample links that you should replace)
- Live Minecraft Java server status using the public `api.mcsrvstat.us` endpoint
- Discord and contact links
- Sign-in/sign-up UI placeholder
- Admin dashboard preview that saves settings in the current browser only

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. For a more realistic local preview, use VS Code's Live Server extension.

## Customize before publishing
Open `index.html` and replace:
- `ENDERVERSE` with your site/community name
- `https://discord.com/` with your real Discord invite
- `hello@example.com` with your contact email
- Sample download links with URLs to files you have permission to distribute
- `mc.hypixel.net` with your server address (or leave the field for visitors to enter an address)

The contact form uses `mailto:` and opens the visitor's email app; it does not send/store messages on a server.

## Free hosting with GitHub Pages
1. Create/sign in to an account at https://github.com/
2. Create a **public** repository, e.g. `enderverse-website`.
3. Extract this ZIP, then upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch `main` and folder `/(root)`, then save.
7. Wait a few minutes. Your URL will look like `https://YOUR-USERNAME.github.io/enderverse-website/`.

## Important security limitations
This is a static front-end template. The sign-in/sign-up form is deliberately a UI placeholder and does not create accounts or store passwords. The admin dashboard is a local preview, not a secure admin system. Do not use it to protect real data or control a live server.

For real accounts and a protected admin dashboard, connect a backend such as Supabase:
- Enable Supabase Auth and use its client SDK for sign-up/sign-in.
- Store admin roles and editable site settings in database tables.
- Enable Row Level Security (RLS) policies so only authorized admins can change protected settings.
- Never put service-role keys or private credentials in browser JavaScript.
- If you need to run server commands or manage Minecraft server files, use a trusted backend with server-side authorization; never expose panel credentials in this site.

GitHub Pages supports static websites, not server-side code. You can keep the front end on GitHub Pages and use a separate backend for authentication and data.
