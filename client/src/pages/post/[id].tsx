import IPost from "../../types/IPost";
import { getPost } from "../../gateways/PostGateway";
import Post from "components/post/Post";
import NotFoundPage from "pages/404";
import MainLayout from "components/layout/MainLayout";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { IResponse, failureResponse } from "gateways/GatewayResponses";

interface PostPageProps {
  staticPost?: IResponse<IPost>;
}

const PostPage: NextPage<PostPageProps> = ({ staticPost }) => {
  const router = useRouter();
  const { id } = router.query;
  const postNumber = id ? Number(id) : undefined;
  const { data } = useQuery(
    ["post", postNumber],
    () => (postNumber ? getPost(postNumber) : undefined),
    { initialData: staticPost, initialDataUpdatedAt: Date.now() - 60000 }
  );

  if (!postNumber) {
    return <MainLayout />;
  }
  if (isNaN(postNumber)) {
    return <NotFoundPage />;
  }
  const post = data?.success ? data.payload : undefined;
  if (!post) {
    return <MainLayout />;
  }

  return (
    <>
      <Head>
        <title>Post {post.postNumber} - Dear Blueno</title>
      </Head>
      <MainLayout
        title={`Post #${post.postNumber}`}
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

export const getStaticProps: GetStaticProps = async (context) => {
  const postNumber = Number(context.params?.id as string);
  const post = await getPost(postNumber);
  if (post.success) {
    return {
      props: {
        post: post,
      },
      revalidate: 30,
    };
  }
  return {
    props: {
      post: failureResponse("Post not found"),
    },
    revalidate: 30,
  };
};

export function getStaticPaths() {
  return { fallback: "blocking", paths: [] };
}

export default PostPage;
