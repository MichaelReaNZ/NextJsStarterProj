//Example of Authenticated client component
"use client";
import { useSession } from "next-auth/react";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  console.log(session, status);

  if (status === "authenticated") {
    return <>{children}</>;
  } else {
    //get parent component name
    console.log("Access Denied from AuthCheck.tsx");
    return <></>;
  }
}
