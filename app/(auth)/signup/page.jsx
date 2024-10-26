"use client";

import { UserContext } from "@/context/UserContext";
import { supabase } from "@/utils/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Link from "next/link";

const Page = () => {
  const { session } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleSearchParams = async () => {
      if (searchParams.has("complete_registration")) {
        const response = await fetch("api/user/create", {
          method: "POST",
          headers: {
            "X-Supabase-Auth": session.data.session.access_token + " " + session.data.session.refresh_token,
          },
          body: JSON.stringify({
            email: session.data.session.user.email,
            user_id: session.data.session.user.id,
          }),
        });
        if (response.status === 201) console.log("Success");
        setTimeout(() => router.push("/"), 1000);
      } else {
        router.push("/");
      }
    };

    if (session?.data.session) {
      handleSearchParams();
    } else if (session) {
      setLoading(false);
    }
  }, [session]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!session || session.data.session) return;
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <main>
          <h1 className="font-bold text-xl">Sign Up</h1>
          <form className="flex flex-col" onSubmit={onSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm Password"
            />
            <button type="submit">Submit</button>
            <Link href={"/signin"} className="text-sm text-blue-500 hover:underline">
              Already have an account? Sign in.
            </Link>
          </form>
        </main>
      )}

      <Footer />
    </div>
  );
};

export default Page;
