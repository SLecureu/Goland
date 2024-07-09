import { Icons } from "../assets/assets";

import "../pages/Loader.scss";

function Loader() {
    return <img src={Icons.logo} alt="Loading" className="loader" />;
}

export default Loader;
