import { Link } from "react-router-dom";
import { CONTACT } from "../constants";

const Header = () => {
  return (
    <nav className="mb-16 flex justify-between items-center py-6">
      <div className="flex shrink-0 items-center">
        <h1 className="lg:ml-4 font-bold text-2xl">KhanhDuyDev</h1>
      </div>
      <div className="my-4 lg:mr-4 flex items-center justify-center gap-4 text-2xl">
        <Link target="_blank" to={CONTACT.github.url}>
          {CONTACT.github.icon}
        </Link>
        <Link target="_blank" to={CONTACT.linkedin.url}>
          {CONTACT.linkedin.icon}
        </Link>
        <Link target="_blank" to={CONTACT.facebook.url}>
          {CONTACT.facebook.icon}
        </Link>
      </div>
    </nav>
  );
};

export default Header;
