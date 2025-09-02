import { auth } from '@repo/auth/server';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const user = await auth();

  if (!user.userId) {
    redirect('/sign-in');
  }

  // User is authenticated, redirect to dashboard
  redirect('/dashboard');
}