import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';

export function loader({ request }: LoaderFunctionArgs) {
  return authenticator.logout(request, { redirectTo: '/login' });
}
