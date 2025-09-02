import { Homepage } from '@/app/(unauthenticated)/homepage';
import { auth } from '@repo/auth/server';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const user = await auth();

  if (user.userId) {
    redirect('/dashboard');
  }
  
  return <Homepage />;
}
