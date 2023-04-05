import { GetServerSideProps } from "next";
import { getAllPostNumbers } from "gateways/PostGateway";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await getAllPostNumbers();
  if (!response.success) {
    return {
      notFound: true,
    };
  }

  const urls = response.payload.map(
    (postNumber) => `https://www.dearblueno.net/post/${postNumber}`
  );

  const { res } = context;
  res.setHeader("Content-Type", "text/plain");
  res.write(urls.join("\n"));
  res.end();

  return {
    props: {},
  };
};

export default function SitemapTxt() {
  return undefined;
}
