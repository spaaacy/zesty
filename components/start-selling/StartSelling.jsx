"use client";

import { useContext, useState } from "react";
import Footer from "../common/Footer";
import Loader from "../common/Loader";
import NavBar from "../common/NavBar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "@/context/UserContext";
import ToastError from "../common/ToastError";
import { useRouter } from "next/navigation";

const StartSelling = () => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { session } = useContext(UserContext);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      image: null,
    },
  });

  const onSubmit = async (data) => {
    const userId = session.data.session.user.id;
    if (!userId) return;
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append(
        "service",
        JSON.stringify({
          name: data.name,
          description: data.description,
          user_id: userId,
        })
      );
      formData.append("image", data.image);

      const response = await fetch("/api/service/create", {
        method: "POST",
        headers: {
          "X-Supabase-Auth": session.data.session.access_token + " " + session.data.session.refresh_token,
        },
        body: formData,
      });
      if (response.status === 201) {
        const { serviceId } = await response.json();
        router.push(`/service/${serviceId}`);
      } else {
        const { error } = await response.json();
        throw error;
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.custom((t) => <ToastError />);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      form.setValue("image", file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {loading ? (
        <Loader />
      ) : (
        <main>
          <Card className="mx-auto max-w-[42rem]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle>Create Service</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="image"
                    rules={{
                      required: "Image is required",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Image</FormLabel>
                        {imagePreview && (
                          <Image
                            width={256}
                            height={256}
                            className="mx-auto rounded"
                            unoptimized
                            src={imagePreview}
                            alt="image_preview"
                          />
                        )}
                        <FormControl>
                          <Input type="file" accept="image/*" onChange={handleImageChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    rules={{
                      required: "Name is required",
                      minLength: { value: 8, message: "Name must be at least 8 characters" },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="My Service" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    rules={{
                      required: "Description is required",
                      minLength: { value: 8, message: "Description must be at least 8 characters" },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="What's your service about?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
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

export default StartSelling;
