"use client";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className={`w-full rounded py-3 shadow-md my-1  bg-white`}>
      <div className="flex justify-around ">
        <h2 className="text-xl md:text-2xl">CipherTalk</h2>

        {session ? (
          <>
            <p className="md:text-xl pt-1">welcome {user?.username}</p>
            <button
              className="py-1 px-4 rounded bg-black text-white"
              onClick={() => signOut()}
            >
              SignOut
            </button>
          </>
        ) : (
          <Link href={`/sign-in`}>
            <button className="py-1 px-4 bg-black text-white rounded">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
