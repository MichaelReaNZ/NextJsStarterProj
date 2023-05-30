"use client";

import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  id: string;
  name: string;
};

export default function StoryRow({ id, name }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!pathname) return;

    setActive(pathname.includes(id));
  }, [id, pathname]);

  const RemoveStory = async () => {
    await axios
      .post("/api/story/", {
        storyID: id,
        session,
      })

      .catch((error) => {
        //Toast error
        console.log(error);
      });

    router.push("/");
  };

  return (
    <Link
      href={`/story/${id}`}
      className={`storyRow justify-center ${active && "bg-gray-700/50"}`}
    >
      <ChatBubbleLeftIcon className="h-5 w-5" />
      <p className="flex-1 hidden md:inline-flex truncate">{name}</p>
      <TrashIcon
        onClick={RemoveStory}
        className="h-5 w-5 text-gray-700 hover:text-red-700"
      />
    </Link>
  );
}
