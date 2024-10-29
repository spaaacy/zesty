"use client";

import { useContext, useEffect, useState } from "react";
import Footer from "../common/Footer";
import Loader from "../common/Loader";
import NavBar from "../common/NavBar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { DatePicker } from "../ui/date-picker";
import { toTimestampTz } from "@/utils/toTimestamptz";

const CreateEvent = () => {
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const { session, user } = useContext(UserContext);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      location: "",
      image: null,
      date: null,
      time: "",
    },
  });

  useEffect(() => {
    if (session) {
      if (!session.data.session) {
        router.push("/signin");
      } else {
        if (user)
          if (!user.admin) {
            router.push("/events");
          } else setLoading(false);
      }
    }
  }, [session, user]);

  const onSubmit = async (data) => {
    const userId = session.data.session.user.id;
    if (!userId) return;
    try {
      setLoading(true);

      const formData = new FormData();
      console.log(data);
      formData.append(
        "event",
        JSON.stringify({
          name: data.name,
          description: data.description,
          location: data.location,
          datetime: toTimestampTz(data.date, data.time),
        })
      );
      formData.append("image", data.image);
      const response = await fetch("/api/event/create", {
        method: "POST",
        headers: {
          "X-Supabase-Auth": session.data.session.access_token + " " + session.data.session.refresh_token,
        },
        body: formData,
      });
      if (response.status === 201) {
        const { eventId } = await response.json();
        router.push(`/events`);
      } else {
        const { error } = await response.json();
        throw error;
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Oops, something went wrong...");
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
                  <CardTitle className="text-xl">Create Store</CardTitle>
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
                        <FormLabel className="font-medium">
                          Image<span className="text-red-500"> *</span>
                        </FormLabel>
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
                        <FormLabel>
                          Name<span className="text-red-500"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Event Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      rules={{
                        required: "Location is required",
                      }}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Location<span className="text-red-500"> *</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date"
                      rules={{
                        required: "Date is required",
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Date<span className="text-red-500"> *</span>
                          </FormLabel>
                          <FormControl>
                            <DatePicker {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      rules={{
                        required: "Time is required",
                      }}
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>
                            Time<span className="text-red-500"> *</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* <FormField
                    control={form.control}
                    name="description"
                    rules={{
                      required: "Description is required",
                      minLength: { value: 8, message: "Description must be at least 8 characters" },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Description<span className="text-red-500"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="What's the event about?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
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

export default CreateEvent;
