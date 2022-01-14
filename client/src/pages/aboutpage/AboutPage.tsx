import "./AboutPage.css";
import LogoIcon from "../../images/logo128.png";
import { Link } from "react-router-dom";

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
            Lorem ipsum dolor sit amet. Et facere accusantium ex reiciendis
            aspernatur qui sapiente galisum in illo expedita ut impedit
            quibusdam. Qui omnis mollitia et quia facilis ea quam debitis. Et
            maiores velit eum eaque iure aut veritatis tenetur 33 veniam placeat
            ea illum excepturi.
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
          <p>
            Lorem ipsum dolor sit amet. Et facere accusantium ex reiciendis
          </p>
        </div>
        <div className="AboutPageSection">
          <h3 className="SectionHeader">CONTACT</h3>
          <p>
            For any questions/comments regarding the website, bugs, or
            business inquires, please contact us at{" "}
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
