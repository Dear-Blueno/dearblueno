import styles from "styles/PostPage.module.scss";
import IPost from "../../types/IPost";
import { getPost } from "../../gateways/PostGateway";
import Post from "components/post/Post";
import NotFoundPage from "pages/404";
import MainLayout from "components/layout/MainLayout";
import { GetStaticProps, NextPage } from "next";

type PostPageProps = {
  post?: IPost;
};

const PostPage: NextPage = ({ post }: PostPageProps) => {
  if (!post) {
    return <NotFoundPage />;
  }

  return (
    <MainLayout
      title={"Post #" + post.postNumber}
      page={<PostPageMain post={post} />}
    />
  );
};

type PostPageMainProps = {
  post: IPost;
};

function PostPageMain({ post }: PostPageMainProps) {
  return (
    <div className={styles.PostPage}>
      <Post post={post} skipAnimation={false} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const postNumber = Number(context.params?.id as string);
  const post = await getPost(postNumber);
  if (post.success) {
    return {
      props: {
        post: post.payload,
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most every 30 seconds
      revalidate: 30,
    };
  }
  return {
    props: {
      post: null,
    },
    revalidate: 30,
  };
};

export async function getStaticPaths() {
  // Server-render and cache pages on the fly.
  return { fallback: "blocking", paths: [] };
}

export default PostPage;
