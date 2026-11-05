import { cookies } from 'next/headers';

export default function Page() {
  // Same login as app/login/route.ts, as a Server Action
  async function login(formData: FormData) {
    'use server';

    const username = formData.get('username');

    if (
      (username !== 'victim' && username !== 'attacker') ||
      formData.get('password') !== 'demo-password'
    ) {
      throw new Error('Invalid credentials');
    }

    (await cookies()).set('demoSession', username, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
  }

  return (
    <form action={login}>
      <input name="username" />
      <input name="password" type="password" />
      <button>Log in</button>
    </form>
  );
}
