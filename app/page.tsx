import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  //Example of authenticated route
  const session = await getServerSession();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return <main></main>;
}
