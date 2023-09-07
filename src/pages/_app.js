import { UpdaterProvider } from "../userContext";
import GlobalStyle from '../styles/GlobalStyles';

function MyApp({ Component, pageProps }) {
  return (
    <UpdaterProvider>
      <GlobalStyle />
      <Component {...pageProps} />
    </UpdaterProvider>
  );
}

export default MyApp;