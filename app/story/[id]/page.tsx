import { prisma } from "@/app/lib/Clients/prisma";
import Story from "@/components/StoryPage/Story";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};
async function StoryPage({ params: { id } }: Props) {
  const session = await getServerSession();
  if (!session) {
    redirect("/api/auth/signin");
  }

  const story = await prisma.story.findFirst({
    where: {
      id: id,
    },
  });

  const initialMessages = await prisma.message.findMany({
    where: {
      storyId: id,
    },
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Story messages={initialMessages} story={story!} />
    </div>
  );
}

export default StoryPage;
