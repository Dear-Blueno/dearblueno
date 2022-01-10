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
        <h3>COMMUNITY GUIDELINES</h3>
        <p>
          Lorem ipsum dolor sit amet. Et facere accusantium ex reiciendis
          aspernatur qui sapiente galisum in illo expedita ut impedit quibusdam.
          Qui omnis mollitia et quia facilis ea quam debitis. Et maiores velit
          eum eaque iure aut veritatis tenetur 33 veniam placeat ea illum
          excepturi.
        </p>
      </div>
      <div className="AboutPagePost">
        <h3>PRIVACY POLICY</h3>
        <p>
          Voluptatibus et corrupti sit amet. Et facere accusantium ex
          reiciendis aspernatur qui sapiente galisum in illo expedita ut impedit
          quibusdam. Qui omnis mollitia et quia facilis ea quam debitis. Et
          magnam neque qui quas pariatur aut veritatis tenetur 33 veniam placeat
          ea illum excepturi.
          <br />
          <br />
          Corrupti accusantium qui tenetur sint quia sint. Sit aliquam aut
          voluptatem ratione.
        </p>
      </div>
      <div className="AboutPagePost">
        <h3>FAQ</h3>
        <p>
          Vel minus iusto et minima qui omnis amet! Ut pariatur dolor eum itaque
          voluptatibus et corrupti accusantium qui tenetur sint quia sint. Sit
          aliquam aut voluptatem ratione aut magnam neque qui quas pariatur.
        </p>
      </div>
      <div className="AboutPagePost">
        <h3>CONTACT</h3>
        <p>
          Est quidem reiciendis eos voluptatum dolorem ad perferendis doloribus
          quo modi quisquam ad quam placeat. Et rerum natus est galisum eius ut
          soluta cumque in voluptas quas. Aut quisquam quae quo sunt vero vel
          veritatis iure est nihil optio quo tempore rerum nam dolorem velit.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
