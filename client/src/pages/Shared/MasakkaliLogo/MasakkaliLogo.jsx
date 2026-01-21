import { Link } from "react-router";
import logo from "../../../assets/logo.png";
const MasakkaliLogo = () => {
  return (
    <Link to="/" className="flex items-end hover:opacity-80 transition-opacity">
      <img className="object-cover" src={logo} alt="logo" />
      <p className="text-xl sm:text-2xl font-extrabold">Masakkali</p>
    </Link>
  );
};

export default MasakkaliLogo;
