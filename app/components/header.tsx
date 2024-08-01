import { Link } from '@remix-run/react';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User } from '@prisma/client';
import RequestDialog from './requestDialog';

const Header = ({ user }: { user: User }) => {
  const initials = user?.name
    .split(' ')
    .map((name) => name[0])
    .join('');

  return (
    <header className="flex justify-between container py-4 items-center">
      <div className="text-3xl font-medium">Vacation Portal</div>

      <div className="space-x-5">
        <RequestDialog />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/requests">My requests</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Days available</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/logout">Log out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
