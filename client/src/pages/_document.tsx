import { Html, Head, Main, NextScript } from "next/document";

function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#d5ebff" />
        <link rel="apple-touch-icon" href="/appleicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="shortcut icon" href="/logo192.png" />
        {/* <!-- Cloudflare Web Analytics --> */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "9ceddf97dad542f0815f23fd842bedab"}'
        ></script>
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="description"
          content="Dear Blueno is the anonymous post board for students and community members at Brown University in Providence."
        />
        <meta property="og:title" content="Dear Blueno" />
        <meta property="og:url" content="https://dearblueno.net" />
        <meta property="og:image" content="/header.png" />
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
        <meta name="twitter:image" content="/header.png" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
