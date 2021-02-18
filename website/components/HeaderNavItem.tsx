import Link from 'next/link';
import { PropsWithChildren } from 'react';

type Props = {
  href: string;
};

export default function HeaderNavItem({ href, children }: PropsWithChildren<Props>) {
  return (
    <Link href={href}>
      <a className="text-lg font-medium py-2 px-4 ml-2 rounded-md transition-colors duration-150 ease-in-out hover:bg-gray-100">
        {children}
      </a>
    </Link>
  );
}
