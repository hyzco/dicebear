import Head from 'next/head';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container font-sans text-gray-900">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="DiceBear is an avatar library for designers and developers." />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Header />
      <main>{children}</main>
    </div>
  );
}
