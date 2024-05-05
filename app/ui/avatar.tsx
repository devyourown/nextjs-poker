import Image from "next/image";

interface AvatarProps {
    imgSrc: string | null;
}

export default function Avatar(props: AvatarProps) {
    return (
        <>
            <div className="avatar overflow-auto">
                <Image
                    src={props.imgSrc == null ? "/profile.png" : props.imgSrc}
                    alt="user-img"
                    fill
                />
            </div>
        </>
    );
}
