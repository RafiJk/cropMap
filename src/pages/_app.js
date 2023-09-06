import { UpdaterProvider } from "../userContext";

function MyApp({ Component, pageProps }) {
  return (
    <UpdaterProvider>
      <Component {...pageProps} />
    </UpdaterProvider>
  );
}

export default MyApp;