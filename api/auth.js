export default function handler(req, res) {
  const { host } = req.headers;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `https://${host}/api/callback`;
  const scope = 'repo,user';

  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}`
  );
}
