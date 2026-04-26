"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
    router.push("/app");
    }  else{
    router.push("/login")
 }
  }, [router]);

}
