//Example of Authenticated API / server component
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Dummy data
const posts = [
  {
    title: "Lorem Ipsum",
    slug: "lorem-ipsum",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.",
  },
];

export async function GET() {
  //getServerSession() Will work in API routes and server components
  const session = await getServerSession();

  if (!session) {
    // redirect or render something else
    // return NextResponse.redirect("/api/auth/signin"); //TODO: not redirecting?
    return NextResponse.json({ message: "Not logged in bro..." });
  }
  return NextResponse.json(posts);
}
