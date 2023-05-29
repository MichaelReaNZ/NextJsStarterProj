import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "../lib/Clients/prisma";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { ProfileForm } from "./ProfileForm";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("api/auth/signin");
  }

  const currentUserEmail = session?.user?.email!;
  const currentUser = await prisma.user.findUnique({
    where: { email: currentUserEmail },
  });

  return (
    <>
      <h1 className="text-3xl mb-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-5">
        Dashboard
      </h1>
      <ProfileForm user={currentUser} />
    </>
  );
}
