import { LoaderFunctionArgs } from '@remix-run/node';
import { $path } from 'remix-routes';
import { authenticator } from '~/services/auth.server';

export function loader({ request }: LoaderFunctionArgs) {
  return authenticator.logout(request, { redirectTo: $path('/login') });
}
