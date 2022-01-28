import "./AboutPage.css";
import LogoIcon from "../../images/logo128.png";
import { Link } from "react-router-dom";
import Collapsible from "react-collapsible";
import Header from "../../components/header/Header";
import IUser from "../../types/IUser";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";

type AboutPageProps = {
  user: IUser | undefined;
};

function AboutPage(props: AboutPageProps) {
  return (
    <div className="AboutPage">
      {window.innerWidth >= 768 && (
        <Link to="/" draggable={false}>
          <img
            className="BluenoHomeButton"
            src={LogoIcon}
            alt="Blueno Home Button"
            draggable={false}
          />
        </Link>
      )}
      {window.innerWidth < 768 && (
        <Header user={props.user} moderatorView={false} />
      )}
      <div className="AboutPagePost">
        <div className="AboutPageSection">
          <h3 className="SectionHeader">DISCLAIMER</h3>
          <p className="PrivSection">
            The approval or denial of submitted content is determined by the
            moderators. Actions taken upon submitted content are in no way
            reflective of the views, opinions, or feelings of the moderator
            team, nor the developers.
          </p>
        </div>
        <div className="AboutPageSection">
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
          </p>
        </div>

        <div className="AboutPageSection">
          <h3 className="SectionHeader">PRIVACY POLICY</h3>
          <div className="PrivPolicy">
            <p className="PrivSection">
              The developers of dearblueno.net are committed to privacy. On
              posts and anonymous comments, no information whatsoever is linked
              to an individual's identity. It is impossible for anyone, even the
              developers of dearblueno.net, to know who the original poster is.
            </p>
            <p className="PrivSection">
              Since all users must login with Google, we do receive some of your
              existing Google account details, such as email address, profile
              picture, and name. We have absolutely no way of changing this
              information, nor do we have the ability to obtain any overly
              sensitive information from Google. For more information regarding
              how Google handles your information, please visit{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google's Privacy Policy.
              </a>
            </p>
            <p className="PrivSection">
              Depending on the extent by which you interact with the site, our
              servers may also receive general device information such as your
              operating system and browser type. This information is not linked
              to your identity.
            </p>
            <p className="PrivSection">
              For content optimization, we make use of the Cloudflare content
              delivery network and ImgBB image embeds. For web and mobile
              analytics, we make use of Cloudflare web analytics. For user
              account registration and authentication, we make use of Google
              OAuth2. For more information regarding how Cloudflare handles your
              information, please visit{" "}
              <a
                href="https://www.cloudflare.com/privacy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cloudflare's Privacy Policy.
              </a>
            </p>
            <p className="PrivSection">
              All personal data, as described above, is stored in a database on
              our servers. This data is not sold, sent, or shared with anyone
              else.
            </p>
            <p className="PrivSection">
              As part of our commitment to transparency, the entirety of our
              code is open source. It can be found at this{" "}
              <a
                href="https://github.com/Dear-Blueno"
                target="_blank"
                rel="noopener noreferrer"
              >
                github repository
              </a>{" "}
              and is licensed under the AGPLv3 license.
            </p>
          </div>
        </div>

        <div className="AboutPageSection">
          <h3 className="SectionHeader">FAQ</h3>
          <div className="Accordion">
            <Collapsible
              trigger=" Why isn't my comment showing up?"
              className="FAQQuestion"
              transitionTime={100}
            >
              <p className="FAQAnswer">
                Your comment may not be showing up for multiple reasons. If your
                comment was submitted anonymously, the moderators may have not
                got around to reviewing it yet, or it may been denied.
                Otherwise, your comment may have been automatically deleted for
                containing potentially dangerous content. Finally, your comment
                may have been manually removed by a moderator for violating our
                community guidelines.
              </p>
            </Collapsible>

            <Collapsible
              trigger="Why isn't my post showing up?"
              className="FAQQuestion"
              transitionTime={100}
            >
              <p className="FAQAnswer">
                If your post is not showing up, it either means that it has not
                yet been approved by our moderators, or it was rejected for not
                being compliant with our community guidelines. To familiarize
                yourself with our community guidelines, please visit the top of
                the About Page.{" "}
              </p>
            </Collapsible>
            <Collapsible
              trigger="Why are their different submit forms?"
              className="FAQQuestion"
              transitionTime={100}
            >
              <div className="FAQAnswer">
                <p>
                  There are 3 kinds of submit forms we support: built-in,
                  verified Google Form, and unverified Google Form. Our built-in
                  submit form performs a check to see if the user is logged in
                  with a Brown email. If so, the post is deemed "verified" upon
                  submission, but no information tying the post to the user is
                  stored.
                </p>
                <p>
                  The Google Forms are provided for those who perhaps do not
                  feel comfortable using a form built in to our site, or simply
                  prefer the experience of typing in a Google Form.
                </p>
                <p>No form posseses any advantage over the others.</p>
              </div>
            </Collapsible>
            <Collapsible
              trigger="How do I submit an anonymous comment?"
              className="FAQQuestion"
              transitionTime={100}
            >
              <p className="AnonAnswer">
                Clicking the {<AiOutlineEye className="AboutPageIcon"/>} icon at the bottom left of a new comment box will toggle a comment to be anonymous.
                Clicking the {<AiOutlineEyeInvisible className="AboutPageIcon"/>} icon that now appears will return it to being public. 
              </p>
            </Collapsible>
            <Collapsible
              trigger="Is this related to the DB Facebook Group?"
              className="FAQQuestion"
              transitionTime={100}
            >
              <p className="FAQAnswer">
                No. dearblueno.net was created by a group of Brown University
                students following the deletion of the DB Facebook Group. While
                we did reach out to the original DB and BBA mods, we
                unfortunately did not receive a response. dearblueno.net is a
                community-based project, and we hope to have the opportunity to
                work with the DB and BBA mods in the future.
              </p>
            </Collapsible>
            <Collapsible
              trigger="Who runs Dear Blueno?"
              className="FAQQuestion"
              transitionTime={100}
            >
              <p className="FAQAnswer">¯\_(ツ)_/¯</p>
            </Collapsible>
          </div>
        </div>
        <div className="AboutPageSection">
          <h3 className="SectionHeader">CONTACT</h3>
          <p>
            For any questions/comments regarding the website, suggestions,
            feedback, bugs, or business inquires, please contact us at{" "}
            <a href="mailto:developers@dearblueno.net" className="EmailLink">
              developers@dearblueno.net
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
