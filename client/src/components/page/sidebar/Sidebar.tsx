import styles from "./Sidebar.module.scss";
import LogoIcon from "images/logo512.png";
import { useRouter } from "next/router";
import Image from "next/image";
import { useMemo } from "react";

type SidebarItem = {
  path: string;
  label: string;
};

export default function Sidebar() {
  const router = useRouter();
  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      {
        path: "/",
        label: "Home",
      },
      {
        path: "/notifications",
        label: "Notifications",
      },
      {
        path: "/bookmarks",
        label: "Bookmarks",
      },
      {
        path: "/search",
        label: "Search",
      },
      {
        path: "/profile",
        label: "Profile",
      },
      {
        path: "/about",
        label: "About",
      },
    ],
    []
  );

  return (
    <nav className={styles.Sidebar}>
      <a href="/" className={styles.SidebarLogo}>
        <Image src={LogoIcon} alt="Blueno" />
      </a>
      <ul className={styles.SidebarList}>
        {sidebarItems.map((item) => (
          <li
            key={item.path}
            className={
              router.pathname === item.path
                ? styles.SidebarListItem + " " + styles.SidebarListItemActive
                : styles.SidebarListItem
            }
          >
            <a href={item.path} className={styles.SidebarListItemLink}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
