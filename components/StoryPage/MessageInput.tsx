"use client";
import { useState, FormEvent } from "react";
import { Message } from "@prisma/client";
import PaperAirplaneIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";

type Props = {
  storyId: string;
  addMessage: (newMessage: Message) => void;
};

const MessageInput: React.FC<Props> = ({ storyId, addMessage }) => {
  const [prompt, setPrompt] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newMessage: Message = {
      id: Math.random().toString(), //TODO: get db to autogenerate this
      content: prompt,
      storyId: storyId,
      authorId: "Michael",
      role: "user",
    };

    // Add the new message to the messages array in the parent component
    addMessage(newMessage);

    setPrompt(""); // clear the input after sending

    const body = {
      message: newMessage,
      storyId: storyId,
    };

    const res = await fetch("/api/message", {
      method: "PUT",
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
      <form onSubmit={handleSubmit} className="p-5 space-x-5 flex">
        <input
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-[#11A37F] hover:opacity-50 text-white font-bold
          px-4 py-2 rounded disabled:bg-gray-300
          disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="h-4 w-4 -rotate-45"></PaperAirplaneIcon>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
