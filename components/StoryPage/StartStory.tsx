"use client";
import { useState, FormEvent } from "react";
import { Message } from "@prisma/client";
import PaperAirplaneIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";
import { BoltIcon } from "@heroicons/react/24/outline";

type Props = {
  storyId: string;
  addMessage: (newMessage: Message) => void;
};

const StartStory: React.FC<Props> = ({ storyId, addMessage }) => {
  const [characterDetails, setCharacterDetails] = useState<string>("");
  const [worldDetails, setWorldDetails] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const body = {
      characterDetails: characterDetails,
      worldDetails: worldDetails,
      storyId: storyId,
    };

    const res = await fetch("/api/message/start", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    //TODO: if it fails either remove the message or highlight it red and say it failed to send

    const responseData = await res.json(); //Is this where streaming would happen?
    console.log(responseData.aiReplyMessage);

    //Add the response ass a message also
    addMessage(responseData.aiReplyMessage);
  };

  return (
    <div className="bg-gray-700/50 text-gray-400 rounded-lg text-sm">
      <form onSubmit={handleSubmit} className="p-5 space-y-5 flex-col">
        <div>
          <input
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            value={characterDetails}
            onChange={(e) => setCharacterDetails(e.target.value)}
            placeholder="Enter as little or as much information about your character..."
          />
        </div>

        <div>
          <input
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            value={worldDetails}
            onChange={(e) => setWorldDetails(e.target.value)}
            placeholder="Describe the world this story is set in..."
          />
        </div>
        <button
          type="submit"
          className="bg-[#11A37F] hover:opacity-50 text-white font-bold
    px-4 py-2 rounded disabled:bg-gray-300
    disabled:cursor-not-allowed"
        >
          <div className="flex col">
            <span className="mr-2">Start a new story!</span>
            <BoltIcon className="h-4 w-4"></BoltIcon>
          </div>
        </button>
      </form>
    </div>
  );
};

export default StartStory;
