import styles from "styles/ModeratorPage.module.scss";
import Head from "next/head";
import MainLayout from "components/layout/MainLayout";
import { NextPage } from "next";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import {
  getModFeedComments,
  getModFeedPosts,
  getModFeedReports,
} from "gateways/PostGateway";
import ModeratorPageHeader from "components/header/moderator/ModeratorPageHeader";
import { useRouter } from "next/router";
import { getModFeedEvents } from "gateways/EventGateway";
import IPost from "types/IPost";
import IComment from "types/IComment";
import { IReport } from "types/IReport";
import IEvent from "types/IEvent";
import ModeratorPost from "components/post/ModeratorPost";
import ContextThread from "components/post/comments/ContextThread";

const ModeratorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Moderator - Dear Blueno</title>
      </Head>

      <MainLayout
        title="Moderator"
        page={<ModeratorPageMain />}
        header={<ModeratorPageHeader />}
      ></MainLayout>
    </>
  );
};

type Sort = "posts" | "comments" | "reports" | "events";
type ModeratorData = IPost[] | IComment[] | IReport[] | IEvent[];

const parseSortQueryParams = (sort: string | string[] | undefined): Sort => {
  if (!sort) {
    return "posts";
  }
  if (typeof sort === "string") {
    return sort as Sort;
  }
  return sort[0] as Sort;
};

const ModeratorPageMain = () => {
  const router = useRouter();
  const sort = parseSortQueryParams(router.query.sort);
  let getter: (param: { pageParam?: number }) => Promise<ModeratorData> = ({
    pageParam = 1,
  }) => getModFeedPosts(pageParam).then((res) => res.payload ?? []);
  if (sort === "comments") {
    getter = ({ pageParam = 1 }) =>
      getModFeedComments(pageParam).then((res) => res.payload ?? []);
  } else if (sort === "reports") {
    getter = ({ pageParam = 1 }) =>
      getModFeedReports(pageParam).then((res) => res.payload ?? []);
  } else if (sort === "events") {
    getter = ({ pageParam = 1 }) =>
      getModFeedEvents(pageParam).then((res) => res.payload ?? []);
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery([`moderator${sort}`], getter, {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return pages.length + 1;
      },
    });

  function typeGuard<T extends ModeratorData>(
    type: Sort
  ): (postData: InfiniteData<ModeratorData>) => postData is InfiniteData<T> {
    return (
      postData: InfiniteData<ModeratorData>
    ): postData is InfiniteData<T> => sort === type;
  }

  if (!data) return null;

  return (
    <div className={styles.List}>
      {typeGuard<IPost[]>("posts")(data) &&
        data.pages.map((page) =>
          page.map((post) => <ModeratorPost key={post._id} post={post} />)
        )}
      {typeGuard<IComment[]>("comments")(data) &&
        data.pages.map((page) =>
          page.map((comment) => (
            <ContextThread key={comment._id} thread={comment} moderatorView />
          ))
        )}
      {/* {typeGuard<IReport[]>("reports")(data) &&
        data.pages.map((page) => {
          console.log(page);
          page.map((report) => (
            <ContextThread key={report.comment._id} thread={report.comment} />
          ));
        })} */}
      {/* <button
        onClick={() => console.log(ata))}
      >
        {" "}
        LOL{" "}
      </button> */}
    </div>
  );
};

export default ModeratorPage;
