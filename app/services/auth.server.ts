import { Authenticator, AuthorizationError } from 'remix-auth';
import { sessionStorage } from '~/services/session.server';
import { FormStrategy } from 'remix-auth-form';
import type { User } from '@prisma/client';
import { prisma } from '~/utils/db.server';
import bcrypt from 'bcryptjs';
import { saltRounds } from '~/config';

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

    if (!user.password) {
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
      return user as User;
    }

    const hashedPassword = user.password;
    if (bcrypt.compareSync(password, hashedPassword)) {
      return user as User;
    }

    throw new AuthorizationError('Incorrect password');
  }),
);
