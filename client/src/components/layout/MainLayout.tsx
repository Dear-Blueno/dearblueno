import PageHeader from "./PageHeader";
import PageSidebar from "./PageSidebar";
import HeaderAndPage from "./HeaderAndPage";
import Page from "./Page";
import { useIsMobile } from "hooks/is-mobile";
import Logo from "./Logo";

interface MainLayoutProps {
  title?: React.ReactNode;
  header?: React.ReactNode;
  page?: React.ReactNode;
  sidebar?: React.ReactNode;
  forceTitle?: boolean;
}

export default function MainLayout(props: MainLayoutProps) {
  const isMobile = useIsMobile();
  return (
    <>
      <HeaderAndPage>
        {isMobile && (
          <h1
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25em",
            }}
          >
            <Logo />
            Dear Blueno
          </h1>
        )}

        <PageHeader
          title={props.title}
          forceTitle={props.forceTitle}
          sidebar={props.sidebar}
        >
          {props.header}
        </PageHeader>
        <Page>{props.page}</Page>
      </HeaderAndPage>
      <PageSidebar>{props.sidebar}</PageSidebar>
    </>
  );
}
