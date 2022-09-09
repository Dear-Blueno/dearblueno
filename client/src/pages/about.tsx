import styles from "styles/AboutPage.module.scss";
import Collapsible from "react-collapsible";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import MainLayout from "components/layout/MainLayout";
import { NextPage } from "next";
import Head from "next/head";
import PrivacyPolicy from "components/privacypolicy/PrivacyPolicy";

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>About - Dear Blueno</title>
      </Head>
      <MainLayout title="About" page={<AboutPageMain />} />
    </>
  );
};

function AboutPageMain() {
  return (
    <div className={styles.AboutPagePost}>
      <div className={styles.AboutPageSection}>
        <h3 className="SectionHeader">COMMUNITY GUIDELINES</h3>
        <p>
          1. Be respectful to other users.
          <br />
          2. Do not post the personal information of others.
          <br />
          3. Racism, sexism, homophobia, antisemitism, and other forms of
          bigotry are not tolerated.
          <br />
          4. Do not spam.
          <br />
          5. Do not post illegal or potentially dangerous content.
          <br />
          6. Posts that contain irrelevant, low-effort content, such as single
          words, may be denied.
          <br />
          7. Image posts that contain nudity in non-art contexts, self-injury,
          graphic violence, or other potentially disturbing content may be
          denied. Image posts that contain intellectual property violations may
          be denied.
          <br />
        </p>
      </div>

      <div className={styles.AboutPageSection}>
        <h3 className="SectionHeader">FAQ</h3>
        <div className="Accordion">
          <Collapsible
            trigger=" Why isn't my comment showing up?"
            triggerClassName={styles.FAQQuestion}
            triggerOpenedClassName={
              styles.FAQQuestion + " " + styles["is-open"]
            }
            transitionTime={100}
          >
            <p className={styles.FAQAnswer}>
              Your comment may not be showing up for multiple reasons. If your
              comment was submitted anonymously, the moderators may have not got
              around to reviewing it yet, or it may been denied. Otherwise, your
              comment may have been automatically deleted for containing
              potentially dangerous content. Finally, your comment may have been
              manually removed by a moderator for violating our community
              guidelines.
            </p>
          </Collapsible>

          <Collapsible
            trigger="Why isn't my post showing up?"
            triggerClassName={styles.FAQQuestion}
            triggerOpenedClassName={
              styles.FAQQuestion + " " + styles["is-open"]
            }
            transitionTime={100}
          >
            <p className={styles.FAQAnswer}>
              If your post is not showing up, it either means that it has not
              yet been approved by our moderators, or it was rejected for not
              being compliant with our community guidelines. To familiarize
              yourself with our community guidelines, please visit the top of
              the About Page.{" "}
            </p>
          </Collapsible>
          <Collapsible
            trigger="Why are there different submit forms?"
            triggerClassName={styles.FAQQuestion}
            triggerOpenedClassName={
              styles.FAQQuestion + " " + styles["is-open"]
            }
            transitionTime={100}
          >
            <div className={styles.FAQAnswer}>
              <p>
                There are 3 kinds of submit forms we support: built-in, verified
                Google Form, and unverified Google Form. Our built-in submit
                form performs a check to see if the user is logged in with a
                Brown email. If so, the post is deemed {'"verified" '}
                upon submission, but no information tying the post to the user
                is stored.
              </p>
              <p>
                The Google Forms are provided for those who perhaps do not feel
                comfortable using a form built in to our site, or simply prefer
                the experience of typing in a Google Form.
              </p>
              <p>No form possesses any advantage over the others.</p>
            </div>
          </Collapsible>
          <Collapsible
            trigger="How do I submit an anonymous comment?"
            triggerClassName={styles.FAQQuestion}
            triggerOpenedClassName={
              styles.FAQQuestion + " " + styles["is-open"]
            }
            transitionTime={100}
          >
            <p className={styles.AnonAnswer}>
              Clicking the {<AiOutlineEye className={styles.AboutPageIcon} />}{" "}
              icon at the bottom left of a new comment box will toggle a comment
              to be anonymous. Clicking the{" "}
              {<AiOutlineEyeInvisible className={styles.AboutPageIcon} />} icon
              that now appears will return it to being public.
            </p>
          </Collapsible>
          <Collapsible
            trigger="Is this related to the DB Facebook Group?"
            triggerClassName={styles.FAQQuestion}
            triggerOpenedClassName={
              styles.FAQQuestion + " " + styles["is-open"]
            }
            transitionTime={100}
          >
            <p className={styles.FAQAnswer}>
              No. dearblueno.net was created by a group of Brown University
              students following the deletion of the DB Facebook Group. While we
              did reach out to the original DB and BBA mods, we unfortunately
              did not receive a response. dearblueno.net is a community-based
              project, and we are open to working with anyone that is interested
              in helping us maintain the site.
            </p>
          </Collapsible>
        </div>
      </div>

      <div className={styles.AboutPageSection}>
        <h3 className="SectionHeader">PRIVACY POLICY</h3>
        <div className={styles.PrivPolicy}>
          <PrivacyPolicy />
        </div>
      </div>
      <div className={styles.AboutPageSection}>
        <h3 className="SectionHeader">CONTACT</h3>
        <p>
          For any questions/comments regarding the website, suggestions,
          feedback, bugs, or business inquires, please contact us at{" "}
          <a
            href="mailto:developers@dearblueno.net"
            className={styles.EmailLink}
          >
            developers@dearblueno.net
          </a>
          .
        </p>
      </div>
      <div className={styles.AboutPageSection}>
        <h3 className="SectionHeader">DISCLAIMER</h3>
        <p className="PrivSection">
          The approval or denial of submitted content is determined by the
          moderators. Actions taken upon submitted content are in no way
          reflective of the views, opinions, or feelings of the moderator team,
          nor the developers.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
