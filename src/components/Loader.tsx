import { FC, ImgHTMLAttributes } from "react";
import { Icons } from "../assets/assets";

interface LoaderProps extends ImgHTMLAttributes<HTMLImageElement> {}

const Loader: FC<LoaderProps> = ({ width, height }) => {
  return (
    <main>
      <img src={Icons.logo} className="loader" width={width} height={height} />
    </main>
  );
};

export default Loader;
