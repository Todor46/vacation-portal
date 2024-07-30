import { Outlet } from '@remix-run/react';

export default function Index() {
  return (
    <>
      <header>Testing header</header>
      <Outlet />
    </>
  );
}
