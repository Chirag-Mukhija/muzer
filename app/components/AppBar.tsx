'use client';

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const AppBar = () => {
  const { data: session, status } = useSession(); // ✅ Correct way to use useSession()

  return (
    <div className="flex justify-between">
      <div>Muzer</div>
      <div className="m-2">
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : session?.user ? (
          <button onClick={() => signOut()}>Sign out</button>
        ) : (
          <button
            className="m-2 p-2 bg-amber-300 rounded"
            onClick={() => signIn()}
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
};

export default AppBar;
