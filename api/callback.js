export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    res.status(400).send('Missing code parameter');
    return;
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json();

  if (data.error) {
    res.status(401).send(`OAuth error: ${data.error_description}`);
    return;
  }

  const token = data.access_token;

  // Pass the token back to Decap CMS via postMessage
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html>
<body>
<script>
  (function() {
    const token = ${JSON.stringify(token)};
    const message = JSON.stringify({ token, provider: 'github' });

    function sendToken(event) {
      window.opener.postMessage('authorization:github:success:' + message, event.origin);
      window.removeEventListener('message', sendToken);
    }

    window.addEventListener('message', sendToken);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
</body>
</html>`);
}
