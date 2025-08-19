import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getSessionCompanyUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.companyId || !session.user?.id) {
    throw new Error('Awood uma lihid. companyId ama userId lama helin.');
  }
  return { companyId: session.user.companyId, userId: session.user.id };
}
