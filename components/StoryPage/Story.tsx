"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Message, Story } from "@prisma/client";
import MessageComponent from "./Message";
import MessageInput from "./MessageInput";
import StartStory from "./StartStory";

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
    setMessages((currentMessages) => [...currentMessages, newMessage]);
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter((message) => message.id !== id));
  };

  return (
    <div className="flex flex-col h-screen">
      {messages && messages.length > 0 ? (
        <>
          <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            <div className="header text-lg text-center py-5 text-white">
              <h1>Story ID: {story.id}</h1>
              <h3>Story Name: {story.name}</h3>
            </div>

            <div>
              {messages.map((message) => (
                <MessageComponent
                  index={messages.indexOf(message)}
                  key={message.id}
                  message={message}
                  deleteMessage={deleteMessage}
                  addMessage={addMessage}
                  storyId={story.id}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <MessageInput storyId={story.id} addMessage={addMessage} />
        </>
      ) : (
        //Text field for character info
        <StartStory storyId={story.id} addMessage={addMessage} />
      )}
    </div>
  );
}

export default Story;
