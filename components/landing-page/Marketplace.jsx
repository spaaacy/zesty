"use client";

import { useContext, useEffect, useState } from "react";
import Loader from "../common/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { UserContext } from "@/context/UserContext";

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
        console.log(stores);
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
    <main>
      <h1 className="text-3xl font-bold mb-4">Available Stores</h1>
      <div className="grid grid-cols-4 ">
        {stores &&
          stores.map((s, i) => {
            console.log(s);
            return (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{s.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_STORAGE_PATH}/store-image/${s.id}/${s.image_id}`}
                    alt={`store ${i} image`}
                    height={176}
                    width={176}
                    className="object-cover h-44 w-44 drop-shadow mx-auto rounded"
                  />
                  <p>{s.description}</p>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </main>
  );
};

export default Marketplace;
