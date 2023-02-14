import { Html, Head, Main, NextScript } from "next/document";

function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
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
        {/* <!-- Cloudflare Web Analytics --> */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "9ceddf97dad542f0815f23fd842bedab"}'
        ></script>

        <meta name="application-name" content="Dear Blueno" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dear Blueno" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link
          rel="apple-touch-startup-image"
          href="/icons/apple_splash_2048.png"
        />

        <meta
          name="description"
          content="Dear Blueno is the unofficial anonymous post board for students and community members at Brown University in Providence."
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#F5E3E3" />

        <meta name="theme-color" content="#F5E3E3" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://dearblueno.net" />
        <meta name="twitter:title" content="Dear Blueno" />
        <meta
          name="twitter:description"
          content="Dear Blueno is the unofficial anonymous post board for students and community members at Brown University in Providence."
        />
        <meta name="twitter:image" content="/icons/logo192.png" />
        <meta name="twitter:creator" content="@DearBlueno" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Dear Blueno" />
        <meta
          property="og:description"
          content="Dear Blueno is the unofficial anonymous post board for students and community members at Brown University in Providence."
        />
        <meta property="og:site_name" content="Dear Blueno" />
        <meta property="og:url" content="https://dearblueno.net" />
        <meta property="og:image" content="/icons/apple-touch-icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
