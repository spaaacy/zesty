"use client";

import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Loader from "../common/Loader";
import { UserContext } from "@/context/UserContext";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { useRouter } from "next/navigation";

const StorePage = () => {
  const { session } = useContext(UserContext);
  const params = useParams();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState();
  const [products, setProducts] = useState();
  const router = useRouter();

  useEffect(() => {
    if (!dataLoaded && session) {
      setDataLoaded(true);
      loadStore();
      loadProducts();
    }
  }, [session]);

  const loadProducts = async () => {
    try {
      const response = await fetch(
        `/api/store/${params.id}/product`,
        session.data.session
          ? {
              headers: {
                "X-Supabase-Auth": session.data.session.access_token + " " + session.data.session.refresh_token,
              },
              method: "GET",
            }
          : {
              method: "GET",
            }
      );
      if (response.status === 200) {
        const { products } = await response.json();
        setProducts(products);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadStore = async () => {
    try {
      const response = await fetch(
        `/api/store/${params.id}`,
        session.data.session
          ? {
              headers: {
                "X-Supabase-Auth": session.data.session.access_token + " " + session.data.session.refresh_token,
              },
              method: "GET",
            }
          : {
              method: "GET",
            }
      );
      if (response.status === 200) {
        const { store } = await response.json();
        setStore(store);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {loading ? (
        <Loader />
      ) : (
        <main>
          {store && (
            <div>
              <div className="relative h-[16rem] drop-shadow-md text-white p-4">
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black opacity-80 to-transparent rounded-b-xl" />
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_STORAGE_PATH}/store-image/${store.id}/${store.image_id}`}
                  alt={`store image`}
                  fill={true}
                  className="object-cover h-44 w-44 drop-shadow mx-auto rounded-xl -z-50 "
                />
                <h1 className="font-bold text-3xl absolute bottom-4">{store.name}</h1>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex flex-col w-52">
                  <h4 className="mt-4 text-lg font-bold">Store Details</h4>
                  <p className="text-sm text-gray-800 font-normal">{store.description}</p>
                  <p className="text text-gray-800 font-normal mt-2">
                    <span className="font-semibold">Unit: </span>
                    {store.unit_number}
                  </p>
                  <p className="text text-gray-800 font-normal">
                    <span className="font-semibold">Contact: </span>
                    {store.contact_number &&
                      `(${String(store.contact_number).slice(0, 3)}) ${String(store.contact_number).slice(
                        3,
                        6
                      )}-${String(store.contact_number).slice(6)}`}
                  </p>
                </div>

                <div className="mt-4 flex-1">
                  <div className="flex items-start justify-between">
                    <h2 className="text-3xl font-bold mb-4">Products</h2>
                    {store?.user_id === session.data.session?.user.id && (
                      <Link
                        className={buttonVariants({ variant: "outline" })}
                        href={`/store/${params.id}/create-product`}
                      >
                        Create product
                      </Link>
                    )}
                  </div>

                  <ul className="flex flex-col gap-4">
                    {products &&
                      products.map((p, i) => {
                        {
                          console.log(
                            `${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_STORAGE_PATH}/product-image/${store.id}/${p.id}/${p.image_id}`
                          );
                        }
                        return (
                          <Card className="flex p-4 gap-4" key={i}>
                            <div className="relative w-24 h-20">
                              <Image
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_STORAGE_PATH}/product-image/${store.id}/${p.id}/${p.image_id}`}
                                alt={`${p.name} image`}
                                fill={true}
                                className="object-cover mx-auto rounded z-50 "
                              />
                            </div>

                            <div className="flex flex-col w-full">
                              <div className="flex w-full">
                                <h3 className="font-medium">{p.name}</h3>
                                <p className="ml-auto mt-2">{`$${p.price.toFixed(2)}`}</p>
                              </div>
                              <p>{p.description}</p>
                            </div>
                          </Card>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
      <Footer />
    </div>
  );
};

export default StorePage;
