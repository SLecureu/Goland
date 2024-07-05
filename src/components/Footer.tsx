import "./Footer.scss";
import { Icons } from "../Imports";

function Footer() {
  return (
    <footer>
      <div className="container">
        <section className="text">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
            distinctio earum repellat quaerat voluptatibus placeat nam, commodi
            optio pariatur est quia magnam eum harum corrupti dicta, aliquam
            sequi voluptate quas.
          </p>
        </section>

        <section className="icons">
          <a href="https://github.com/cramanan">
            <img src={Icons.github} alt="github logo" title="Cramanan" />
          </a>
          <a href="https://github.com/SLecureu">
            <img src={Icons.github} alt="github logo" title="SLecureu" />
          </a>
        </section>
      </div>

      <div className="copyright">© 2024 Copyright: SLecureu & Cramanan</div>
    </footer>
  );
}

export default Footer;
