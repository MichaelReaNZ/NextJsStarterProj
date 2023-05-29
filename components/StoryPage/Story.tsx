"use client";

import { useEffect, useRef, useState } from "react";
import { Message, Story } from "@prisma/client";
import MessageComponent from "./Message";
import MessageInput from "./MessageInput";

type Props = {
  story: Story;
  messages: Message[];
};

function Story({ story, messages: initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (newMessage: Message) => {
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
        <div className="header text-lg text-center py-5 text-white">
          <h1>Story ID: {story.id}</h1>
          <h3>Story Name: {story.name}</h3>
        </div>

        <div>
          {messages.map((message) => (
            <MessageComponent key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <MessageInput storyId={story.id} addMessage={addMessage} />
    </div>
  );
}

export default Story;
