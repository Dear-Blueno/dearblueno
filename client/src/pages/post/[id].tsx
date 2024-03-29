import IPost from "../../types/IPost";
import { getPost, getPostById } from "../../gateways/PostGateway";
import Post from "components/post/Post";
import NotFoundPage from "pages/404";
import MainLayout from "components/layout/MainLayout";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

// interface PostPageProps {
//   post?: IPost;
// }

const PostPage: NextPage = () => {
  const router = useRouter();
  const id = String(router.query.id).trim();
  const postNumber = !isNaN(Number(id)) ? Number(id) : undefined;

  const { data, isLoading } = useQuery(["post", id], () =>
    postNumber ? getPost(postNumber) : getPostById(id)
  );
  const post = data?.success ? data.payload : undefined;

  if (isLoading) {
    return <MainLayout />;
  }
  if (!post) {
    return <NotFoundPage />;
  }

  const numReactions = post.reactions.reduce(
    (acc, reaction) => acc + reaction.length,
    0
  );
  const numComments = post.comments.length;

  return (
    <>
      <Head>
        <title>Post {post.postNumber || post._id} - Dear Blueno</title>
        {post.postNumber && (
          <meta name="post_number" content={post.postNumber.toString()} />
        )}
        <meta name="date" content={post.approvedTime} />
        <meta name="reactions_count" content={numReactions.toString()} />
        <meta name="comments_count" content={numComments.toString()} />
      </Head>
      <MainLayout
        title={`Post ${post.postNumber ? `#${post.postNumber}` : post._id}`}
        page={<PostPageMain post={post} />}
      />
    </>
  );
};

interface PostPageMainProps {
  post: IPost;
}

function PostPageMain({ post }: PostPageMainProps) {
  return <Post post={post} />;
}

// export const getStaticProps: GetStaticProps = async (context) => {
//   const postNumber = Number(context.params?.id as string);
//   const post = await getPost(postNumber);
//   if (post.success) {
//     return {
//       props: {
//         post: post.payload,
//       },
//       // Next.js will attempt to re-generate the page:
//       // - When a request comes in
//       // - At most every 30 seconds
//       revalidate: 30,
//     };
//   }
//   return {
//     props: {
//       post: null,
//     },
//     revalidate: 30,
//   };
// };

// export function getStaticPaths() {
//   // Server-render and cache pages on the fly.
//   return { fallback: "blocking", paths: [] };
// }

export default PostPage;
