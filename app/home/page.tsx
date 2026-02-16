"use client";

import { useAuth } from '@/app/context/AuthContext';

export default function HomePage() {
  const { user, loading } = useAuth();

  return (<div>
    <h1>Welcome {user?.firstName} </h1>
  </div>)
}
