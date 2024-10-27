"use client";

import { UserContext } from "@/context/UserContext";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { Alert, AlertTitle } from "@/components/ui/alert";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const SignIn = () => {
  const { session } = useContext(UserContext);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session?.data.session) {
      router.push("/");
    }
  }, [session]);

  const onSubmit = async (values) => {
    if (!session) return;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (data.user && data.session) {
      location.reload();
    } else {
      toast.custom((t) => (
        <span>
          <Alert variant="destructive">
            <AlertTitle>Oops, something went wrong...</AlertTitle>
          </Alert>
        </span>
      ));
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main>
        <Card className="mx-auto max-w-96">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
              </CardHeader>
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
              </CardContent>
              <CardFooter>
                <Link href={"/signup"} className={`text-xs hover:underline text-blue-700 `}>
                  Don't have an account? Sign up.
                </Link>
                <Button type="submit" className="ml-auto">
                  Submit
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default SignIn;
