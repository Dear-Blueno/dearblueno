import "./AboutPage.css";
import LogoIcon from "../../images/logo128.png";
import { Link } from "react-router-dom";
import Collapsible from "react-collapsible";

type AboutPageProps = {};

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
      <div className="AboutPagePost">
        <div className="AboutPageSection">
          <h3 className="SectionHeader">COMMUNITY GUIDELINES</h3>
          <p>
            1. Be respectful to other users.<br/>
            2. Do not post the personal information of others.<br/>
            3. Racism, sexism, homophobia, antisemitism, and other forms of bigotry are not tolerated.<br/>
            4. Do not spam.<br/>
            5. Do not post illegal or potentially dangerous content.<br/>
          </p>
        </div>

        <div className="AboutPageSection">
          <h3 className="SectionHeader">PRIVACY POLICY</h3>
          <p>
            Lorem ipsum dolor sit amet. Et facere accusantium ex reiciendis
            aspernatur qui sapiente galisum in illo expedita ut impedit
            quibusdam. Qui omnis mollitia et quia facilis ea quam debitis. Et
            maiores velit eum eaque iure aut veritatis tenetur 33 veniam placeat
            ea illum excepturi.
          </p>
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
                Otherwise, your comment may have been automatically deleted by
                our anti-spam system for containing potentially dangerous
                content. Finally, your comment may have been manually removed by
                a moderators for violating our community guidelines.
              </p>
            </Collapsible>
            <Collapsible
              trigger="Why isn't my post showing up?"
              className="FAQQuestion"
              transitionTime={100}
            >
              <p className="FAQAnswer">
                If your post is not showing up, it either means that it has not yet
                been approved by our moderators, or it was rejected for not being
                compliant with our community guidelines. To familiarize yourself
                with our community guidelines, please visit the top of the About Page.{" "}
              </p>
            </Collapsible>
            <Collapsible
              trigger="Who runs Dear Blueno?"
              className="FAQQuestion"
              transitionTime={100}
            >
              <p className="FAQAnswer">
                No one.
              </p>
            </Collapsible>
          </div>
        </div>
        <div className="AboutPageSection">
          <h3 className="SectionHeader">CONTACT</h3>
          <p>
            For any questions/comments regarding the website, bugs, or business
            inquires, please contact us at{" "}
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
