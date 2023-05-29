"use client";

import { prisma } from "@/app/lib/prisma";

async function SideBar() {
  const fetchedStories = await prisma.story.findMany();

  return (
    <>
      <div className="p-2 flex flex-col h-screen">
        <div className="flex-1">
          <h2>New Story</h2>

          {fetchedStories.map((story) => {
            return (
              <div key={story.id}>
                <h3>{story.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default SideBar;
