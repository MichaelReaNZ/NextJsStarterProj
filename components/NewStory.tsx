"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

async function NewStory() {
  const router = useRouter();

  const createNewStory = async () => {
    const res = await fetch("/api/story", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
      },
    });

    //navigate to the new story

    const newObj = await res.json();

    console.log(newObj);

    router.push(`/story/${newObj.id}`);
  };
  return (
    //button with a plus symbol and the text new story
    <div
      onClick={createNewStory}
      className="border-gray-700 border storyRow bg-cyan-700"
    >
      <PlusIcon className="h-4 w-4" />
      <p>New Story</p>
    </div>
  );
}

export default NewStory;
