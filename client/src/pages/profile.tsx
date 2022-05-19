import styles from "styles/ProfilePage.module.scss";
import IUser, { IBasicUser } from "../../types/IUser";
import ProfileBox from "../../components/profile/ProfileBox";
import { getUser } from "../../gateways/UserGateway";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PageAndSidebar from "components/page/pageandsidebar/PageAndSidebar";
import { loadAuth } from "gateways/AuthGateway";
import ProfilePage from "./profile/[id]";

type ProfilePageProps = {
  user?: IUser;
};

export default function MyProfilePage(props: ProfilePageProps) {
  return <ProfilePage user={props.user} />;
}
