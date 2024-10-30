"use client";

import { useContext, useEffect, useState } from "react";
import Loader from "../common/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { UserContext } from "@/context/UserContext";
import Link from "next/link";

const Marketplace = () => {
  const { session } = useContext(UserContext);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState();

  useEffect(() => {
    if (!dataLoaded && session) {
      setDataLoaded(true);
      loadStores();
    }
  }, [session]);

  const loadStores = async () => {
    try {
      const response = await fetch(
        "/api/store",
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
        const { stores } = await response.json();
        setStores(stores);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  return (
    <main className="max-w-[100rem]">
      <h1 className="text-3xl font-bold mb-4">Available Stores</h1>
      <div className="grid grid-cols-4 gap-8 max-sm:flex max-sm:flex-col">
        {stores &&
          stores.map((s, i) => {
            return (
              <Link
                href={`/stores/${s.id}`}
                key={i}
                className="drop-shadow-lg relative h-64 text-white p-4 transition group hover:drop-shadow-xl"
              >
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black opacity-80 to-transparent rounded-b-xl" />
                <div className="fixed bottom-4">
                  <h3 className="text-lg font-semibold group-hover:underline">{s.name}</h3>
                </div>

                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_STORAGE_PATH}/store-image/${s.id}/${s.image_id}`}
                  alt={`store ${i} image`}
                  fill={true}
                  className="object-cover h-44 w-44 drop-shadow mx-auto rounded-xl -z-50"
                />
              </Link>
            );
          })}
      </div>
    </main>
  );
};

export default Marketplace;
