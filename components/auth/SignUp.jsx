"use client";

import { UserContext } from "@/context/UserContext";
import { supabase } from "@/utils/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../common/NavBar";
import Loader from "../common/Loader";

const SignUp = () => {
  const { session } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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
        if (response.status === 201) toast.success("Registration successful");
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

  const onSubmit = async (values) => {
    if (!session || session.data.session) return;
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;

      const response = await fetch("/api/user/create", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          user_id: authData.user.id,
        }),
      });

      if (response.status === 500) {
        const { error } = await response.json();
        throw error;
      }

      toast.success("Please confirm your email");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error("Oops, something went wrong...");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      {loading ? (
        <Loader />
      ) : (
        <main>
          <Card className="mx-auto max-w-96">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
            </CardHeader>
            <Form {...form}>
              <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="example@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    rules={{
                      required: "Confirm password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      validate: (value, formValues) => value === formValues.password || "Passwords do not match",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Link href={"/signin"} className={`text-xs hover:underline text-blue-700 `}>
                    Already have an account? Sign in.
                  </Link>
                  <Button type="submit" className="ml-auto">
                    Submit
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </main>
      )}

      <Footer />
      <Toaster />
    </div>
  );
};

export default SignUp;
