"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function SignInButton() {
  const { data: session, status } = useSession();
  console.log(session, status);

  if (status === "loading") {
    return <>...</>;
  }

  if (status === "authenticated") {
    return (
      <Link href={`/dashboard`}>
        <Image
          src={session.user?.image ?? "/images/placeholder.jpeg"}
          width={32}
          height={32}
          alt="Your Name"
          className="h-12 w-12 rounded-full cursor-pointer mx-auto mb-2 hover:opacity-50
            transition duration-900 ease-in-out 
          "
        />
      </Link>
    );
  }

  return <button onClick={() => signIn()}>Sign in</button>;
}

export function SignOutButton() {
  return (
    <button
      className="bg-slate-600 rounded p-1 m-1 left-1"
      onClick={() => signOut()}
    >
      Sign out
    </button>
  );
}
