"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState, useEffect } from "react";
import { PrismaClient, Story } from "@prisma/client";

const prisma = new PrismaClient();

export default function AnimationTest() {
  const [stories, setStories] = useState<Story[]>([]);
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  const fetchStories = async () => {
    const fetchedStories = await prisma.story.findMany();
    setStories(fetchedStories);
  };

  const addStory = async (storyName: string) => {
    const newStory = await prisma.story.create({
      data: {
        name: storyName,
        userId: "yourUserIdHere", // replace with real userId
      },
    });
    setStories([...stories, newStory]);
  };

  const deleteStory = async (storyId: string) => {
    await prisma.story.delete({ where: { id: storyId } });
    setStories(stories.filter((story) => story.id !== storyId));
  };

  const editStory = async (storyId: string, storyName: string) => {
    const updatedStory = await prisma.story.update({
      where: { id: storyId },
      data: { name: storyName },
    });
    setStories(
      stories.map((story) => (story.id === storyId ? updatedStory : story))
    );
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <>
      <ul ref={parent}>
        {stories.map((story) => (
          <li key={story.id}>
            {story.name}
            <button onClick={() => editStory(story.id, "newName")}>
              Edit
            </button>{" "}
            {/* Replace "newName" with the new story name */}
            <button onClick={() => deleteStory(story.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addStory("New Story")}>Add Story</button>{" "}
      {/* Replace "New Story" with the name of the new story */}
      <button onClick={() => enableAnimations(false)}>Disable</button>
    </>
  );
}
