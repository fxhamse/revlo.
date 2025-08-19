import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getSessionCompanyId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.companyId) {
    throw new Error('Awood uma lihid. companyId lama helin.');
  }
  return session.user.companyId;
}
