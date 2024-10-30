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
import { useParams, useRouter } from "next/navigation";

const CreateProduct = () => {
  const router = useRouter();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const { session } = useContext(UserContext);
  const params = useParams();
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: null,
    },
  });

  useEffect(() => {
    if (session) {
      if (session.data.session) {
        if (!dataLoaded) {
          setDataLoaded(true);
          loadStore();
        }
      } else {
        router.push(`/stores/${params.id}`);
      }
    }
  }, [session]);

  const loadStore = async () => {
    try {
      const response = await fetch(`/api/store/${params.id}/is-owner`, {
        headers: {
          "X-Supabase-Auth": session.data.session.access_token + " " + session.data.session.refresh_token,
        },
        method: "GET",
      });
      if (response.status === 200) {
        const { isOwner } = await response.json();
        if (!isOwner) {
          router.push(`/stores/${params.id}`);
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    const userId = session.data.session.user.id;
    if (!userId) return;
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append(
        "product",
        JSON.stringify({
          name: data.name,
          description: data.description,
          price: data.price,
          store_id: params.id,
        })
      );
      formData.append("image", data.image);

      const response = await fetch("/api/product/create", {
        method: "POST",
        headers: {
          "X-Supabase-Auth": session.data.session.access_token + " " + session.data.session.refresh_token,
        },
        body: formData,
      });
      if (response.status === 201) {
        toast.success("Product created successfully!");
      } else {
        const { error } = await response.json();
        throw error;
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Oops, something went wrong...");
    } finally {
      setLoading(false);
      form.reset({
        name: "",
        description: "",
        price: "",
        image: null,
      });
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
                  <CardTitle className="text-xl">Create Product</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="image"
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

                  <div className="flex items-center gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{
                        required: "Name is required",
                        minLength: { value: 8, message: "Name must be at least 8 characters" },
                      }}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Name<span className="text-red-500"> *</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Product Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      rules={{
                        required: "Price is required",
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Price<span className="text-red-500"> *</span>
                          </FormLabel>
                          <FormControl>
                            <div className="flex items-center max-w-36 ml-1">
                              <span className="text-gray-500 mr-2">$</span>
                              <Input
                                type="number"
                                placeholder="9.99"
                                className="flex-1"
                                step="0.01"
                                {...field}
                                onBlur={(e) => {
                                  let value = parseFloat(e.target.value || 0).toFixed(2);
                                  field.onChange(value);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
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
                          <Textarea placeholder="Describle your product" {...field} />
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

export default CreateProduct;
