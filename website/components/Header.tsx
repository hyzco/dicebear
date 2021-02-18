import Link from 'next/link';
import Image from 'next/image';
import { MarkGithubIcon } from '@primer/octicons-react';
import HeaderNavItem from './HeaderNavItem';

type Props = {};

export default function Header({}: Props) {
  return (
    <header className="h-32 flex items-center">
      <Link href="/">
        <a>
          <Image src="/logo.svg" alt="DiceBear Avatars" width={187} height={48} />
        </a>
      </Link>
      <div className="ml-auto flex items-center">
        <ul className="flex">
          <li>
            <HeaderNavItem href="/docs">Documentation</HeaderNavItem>
          </li>
          <li>
            <HeaderNavItem href="/configurator">Configurator</HeaderNavItem>
          </li>
          <li>
            <HeaderNavItem href="/styles">Styles</HeaderNavItem>
          </li>
        </ul>
        <a href="https://github.com/DiceBear/avatars" target="_blank" className="ml-6">
          <MarkGithubIcon className="h-10 w-10 hover:text-gray-600 transition-colors duration-150 ease-in-out" />
        </a>
      </div>
    </header>
  );
}
