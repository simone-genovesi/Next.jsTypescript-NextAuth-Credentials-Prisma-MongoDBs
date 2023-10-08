'use client';

import { useSession, signOut } from "next-auth/react";

const Dashboard = () => {
    const { data: session } = useSession();
    console.log(session?.user?.email);
  return (
    <div>
        <h1>Dashboard</h1>
        <p>Hi {session?.user?.name}</p>
        <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}

export default Dashboard;