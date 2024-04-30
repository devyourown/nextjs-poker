import clsx from "clsx";
import Image from "next/image";

interface AvatarProps {
  imgSrc: string | null;
}

export default function Avatar(props: AvatarProps) {
  return (
    <>
      <div className="avatar">
        <div className="w-24 rounded-full">
          <Image
            width={32}
            height={32}
            src={props.imgSrc == null ? "/profile.png" : props.imgSrc}
            alt="user-img"
          />
        </div>
      </div>
    </>
  );
}
