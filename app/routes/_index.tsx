import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';
import { prisma } from '~/utils/db.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: '/login' });

  const users = prisma.user.findMany();
  return users;
};

export default function Index() {
  const users = useLoaderData<typeof loader>();
  return (
    <div>
      {users.length
        ? users.map((user) => <p key={user.id}>{user.email}</p>)
        : null}
    </div>
  );
}
