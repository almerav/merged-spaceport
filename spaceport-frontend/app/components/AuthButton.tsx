"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <button onClick={() => signOut()} className="bg-red-500 text-white p-2 rounded">
          Sign Out
        </button>
      ) : (
        <button onClick={() => signIn()} className="bg-blue-600 text-white p-2 rounded">
          Sign In
        </button>
      )}
    </div>
  );
}
