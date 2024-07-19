import { FC, ImgHTMLAttributes } from "react";
import { Icons } from "../assets/assets";

interface LoaderProps extends ImgHTMLAttributes<HTMLImageElement> {}

const Loader: FC<LoaderProps> = (attr) => {
    return <img src={Icons.logo} className="loader" {...attr} />;
};

export default Loader;
