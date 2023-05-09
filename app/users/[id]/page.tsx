import { prisma } from "@/app/lib/prisma";
import FollowButton from "@/components/FollowButton/FollowButton";
import { Metadata } from "next";

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  return { title: `User profile of ${user?.name}` };
}

export default async function UserProfile({ params }: Props) {
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  const { name, bio, image, age, id } = user ?? {};

  return (
    <div>
      <h1>{name}</h1>

      <img
        width={300}
        src={image ?? "/images/placeholder.jpeg"}
        alt={`${name}'s profile`}
      />

      <p>Bio: {bio}</p>
      <p>Age: {age}</p>

      {/* @ts-expect-error Server Component */}
      <FollowButton targetUserId={params.id} />
    </div>
  );
}
