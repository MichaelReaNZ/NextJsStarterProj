import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "./lib/Clients/prisma";

export default async function Home() {
  //Example of authenticated route
  const session = await getServerSession();
  if (!session) {
    redirect("/api/auth/signin");
  }

  const fetchedStories = await prisma.story.findMany();

  return (
    <main>
      <div>
        <button>New Story</button>

        {fetchedStories.map((story) => {
          return (
            <div key={story.id}>
              <h3>Name: {story.name}</h3>
              <h3>Id: {story.id}</h3>
              {/* Hyperlink to story */}
              <a href={`/story/${story.id}`}>Go to story</a>
            </div>
          );
        })}
      </div>
    </main>
  );
}
