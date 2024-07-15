import { FC, ImgHTMLAttributes } from "react";
import { Icons } from "../assets/assets";

interface LoaderProps extends ImgHTMLAttributes<HTMLImageElement> {}

const Loader: FC<LoaderProps> = ({ width, height }) => {
  return (
    <img src={Icons.logo} className="loader" width={width} height={height} />
  );
};

export default Loader;
