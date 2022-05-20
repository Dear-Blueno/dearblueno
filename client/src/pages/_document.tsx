import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
          <meta name="theme-color" content="#d5ebff" />
          <link rel="apple-touch-icon" href="%PUBLIC_URL%/appleicon.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Inconsolata:wght@300..700&display=swap"
            rel="stylesheet"
          />
          <link rel="shortcut icon" href="%PUBLIC_URL%/logo192.png" />
          {/* <!-- Cloudflare Web Analytics --> */}
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "9ceddf97dad542f0815f23fd842bedab"}'
          ></script>
          <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
          <meta
            name="description"
            content="Dear Blueno is the anonymous post board for students and community members at Brown University in Providence."
          />
          <meta property="og:title" content="Dear Blueno" />
          <meta property="og:url" content="https://dearblueno.net" />
          <meta property="og:image" content="%PUBLIC_URL%/header.png" />
          <meta
            property="og:description"
            content="Dear Blueno is the anonymous post board for students and community members at Brown University in Providence."
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Dear Blueno" />
          <meta
            name="twitter:description"
            content="Dear Blueno is the anonymous post board for students and community members at Brown University in Providence."
          />
          <meta name="twitter:image" content="%PUBLIC_URL%/header.png" />
          <script>
            {/* navigator.serviceWorker.register("%PUBLIC_URL%/sw.js"); */}
          </script>
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
