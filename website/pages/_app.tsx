import { AppProps } from 'next/app';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import 'tailwindcss/tailwind.css';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
