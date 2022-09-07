import React from "react";

export default function PrivacyPolicy() {
  return (
    <>
      <p className="PrivSection">
        {`The developers of dearblueno.net ("we", "us", "our") are committed
              to privacy. On posts and anonymous comments, no information
              whatsoever is linked to an individual's identity. It is impossible
              for anyone, even the developers of dearblueno.net, to know who the
              original poster is.`}
      </p>
      <p className="PrivSection">
        For user account registration and authentication, we make use of Google
        OAuth2. When you choose to login to an account, we store a cookie with a
        user session id that allows us to keep you signed-in to your account
        across multiple visits in the same browser. For users that choose to
        login with Google, we receive some basic Google account details,
        including your email address, profile picture, and name. We cannot
        modify these Google account details, nor do we receive any sensitive
        information from Google, such as passwords. For more information
        regarding how Google handles your information, please visit{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          {"Google's Privacy Policy."}
        </a>
      </p>
      <p className="PrivSection">
        To run our services, we store some basic information alongside your
        account. This includes the posts that you have subscribed to, the posts
        that you have bookmarked, and your daily login streak. On posts and
        comments, we store the user ids of users that have reacted to the post
        or comment. We do not store the author of the post or anonymous comment.
        Data about subscribed posts, bookmarked posts, and reactions are
        considered private and are not publicly visible.
      </p>
      <p className="PrivSection">
        For content optimization, we make use of both the Cloudflare content
        delivery network and the Vercel content delivery network. For image
        optimization, we use Imgur to store and host images. Images uploaded to
        dearblueno.net are stored on Imgur, and then are embedded on our site.
        For more information regarding how Imgur handles your information,
        please visit{" "}
        <a
          href="https://imgur.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          {"Imgur's Privacy Policy."}
        </a>
      </p>
      <p className="PrivSection">
        For web and mobile analytics, we make use of Cloudflare Web Analytics.
        Cloudflare Web Analytics is a privacy-friendly analytics platform that
        tracks general device information such as your operating system and
        browser type, but does not use a tracking beacon or any cookies. Thus,
        this analytic information is not linked to your account or identity. For
        more information regarding how Cloudflare handles your information,
        please visit{" "}
        <a
          href="https://www.cloudflare.com/privacy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {"the Cloudflare Privacy Policy."}
        </a>
      </p>
      <p className="PrivSection">
        All data needed to operate dearblueno.net, as described above, is stored
        in a self-hosted MongoDB database. All data is encrypted during transit
        as per industry standards.
      </p>
      <p className="PrivSection">
        We do not and will not sell, share, or rent your personal information to
        any third parties. We do not and will not use your personal information
        to track you across the internet or serve you targeted advertisements.
        All data handled by the site is encrypted during transit. Due to the
        nature of our site, most non-personal information is publicly visible
        and transparently accessible to the public.
      </p>
      <p className="PrivSection">
        As part of our commitment to transparency, the entirety of our code is
        open source. It can be found at this{" "}
        <a
          href="https://github.com/Dear-Blueno"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub repository
        </a>{" "}
        and is licensed under the AGPLv3 license.
      </p>
    </>
  );
}
