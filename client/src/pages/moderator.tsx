import styles from "styles/ModeratorPage.module.scss";
import Head from "next/head";
import MainLayout from "components/layout/MainLayout";
import { NextPage } from "next";
import { useInfiniteQuery } from "@tanstack/react-query";
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

type Sort = "Posts" | "Comments" | "Reports" | "Events";
const parseSortQueryParams = (sort: string | string[] | undefined): Sort => {
  if (!sort) {
    return "Posts";
  }
  if (typeof sort === "string") {
    return sort as Sort;
  }
  return sort[0] as Sort;
};

const ModeratorPageMain = () => {
  const router = useRouter();
  const sort = parseSortQueryParams(router.query.sort);
  let getter: (param: {
    pageParam?: number;
  }) => Promise<IPost[] | IComment[] | IReport[] | IEvent[]> = ({
    pageParam = 1,
  }) => getModFeedPosts(pageParam).then((res) => res.payload ?? []);
  if (sort === "Comments") {
    getter = ({ pageParam = 1 }) =>
      getModFeedComments(pageParam).then((res) => res.payload ?? []);
  } else if (sort === "Reports") {
    getter = ({ pageParam = 1 }) =>
      getModFeedReports(pageParam).then((res) => res.payload ?? []);
  } else if (sort === "Events") {
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

  // need to add type predicate to handle different data types

  return (
    <div className={styles.List}>
      {data?.pages.map((page) =>
        page.map((post) => (
          <ModeratorPost key={post._id} post={post as IPost} />
        ))
      )}
    </div>
  );
};

export default ModeratorPage;
