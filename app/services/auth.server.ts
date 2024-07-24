import { Authenticator, AuthorizationError } from 'remix-auth';
import { sessionStorage } from '~/services/session.server';
import { FormStrategy } from 'remix-auth-form';
import type { User } from '@prisma/client';
import { prisma } from '~/utils/db.server';
import bcrypt from 'bcryptjs';

export const authenticator = new Authenticator<User>(sessionStorage, {
  throwOnError: true,
});

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AuthorizationError('User does not exist');
    }

    const hashedPassword = user.password;
    if (bcrypt.compareSync(password, hashedPassword)) {
      return user as User;
    }

    throw new AuthorizationError('Incorrect password');
  }),
);
