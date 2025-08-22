import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import type { Session } from 'next-auth';

export async function getSessionCompanyUser() {
  const session = (await getServerSession(authOptions)) as Session | null;
  if (!session || !session.user?.companyId || !session.user?.id) {
    throw new Error('Awood uma lihid. companyId ama userId lama helin.');
  }
  return { companyId: session.user.companyId, userId: session.user.id };
}
