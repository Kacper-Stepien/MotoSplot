import DarkLogo from "../assets/logo-dark.svg";
import LightLogo from "../assets/logo-light.svg";

const Logo = () => {
  return (
    <div className="logo text-xl">
      <img
        src={DarkLogo}
        alt="logo"
        className="w-28 md:w-36 lg:w-44 2xl:w-56 dark:hidden"
      />
      <img
        src={LightLogo}
        alt="logo"
        className="w-28 md:w-36 lg:w-44 2xl:w-56 hidden dark:block"
      />
    </div>
  );
};

export default Logo;
