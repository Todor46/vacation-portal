import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import './globals.css';
import { authenticator } from './services/auth.server';
import { LoaderFunctionArgs } from '@remix-run/node';
import Header from './components/header';
import { useTypedLoaderData } from 'remix-typedjson';

export function Layout({ children }: { children: React.ReactNode }) {
  const user = useTypedLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {user ? <Header user={user} /> : null}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (request.url.includes('/login')) return null;
  return await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
}
