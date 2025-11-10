import React from "react";
import { useSession, signOut } from "next-auth/react";

export default function Login() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return (
      <div>
        <p>ログインしていません</p>
        <button onClick={() => signOut()}>ログアウト</button>
      </div>
    );
  }
  return null;
}
