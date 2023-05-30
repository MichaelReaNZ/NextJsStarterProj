// "use client";

import { prisma } from "@/app/lib/Clients/prisma";
import StoryRow from "./StoryRow";
import { getServerSession } from "next-auth";
import { SignInButton, SignOutButton } from "./buttons";
import AuthCheck from "./AuthCheck";
import Link from "next/link";
import Image from "next/image";
import NewStory from "./NewStory";

export default async function SideBar() {
  const session = await getServerSession();

  const fetchedStories = await prisma.story.findMany();
  return (
    <>
      <div className="p-2 flex flex-col h-screen">
        <Link href={"/"}>
          <Image
            src="/logo.png" // Route of the image file
            width={96}
            height={10}
            alt="NextSpace Logo"
          />
        </Link>
        <div className="flex-1">
          {/* @ts-expect-error Server Component */}
          <NewStory />
          {fetchedStories.map((story) => {
            return <StoryRow key={story.id} id={story.id} name={story.name} />;
          })}
        </div>

        <SignInButton />
        <AuthCheck>
          <SignOutButton />
        </AuthCheck>
      </div>
    </>
  );
}
