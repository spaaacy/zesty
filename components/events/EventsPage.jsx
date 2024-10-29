"use client";

import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import Loader from "../common/Loader";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

const EventsPage = () => {
  const { session } = useContext(UserContext);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState();

  useEffect(() => {
    if (!dataLoaded && session) {
      setDataLoaded(true);
      loadEvents();
    }
  }, [session]);

  const loadEvents = async () => {
    try {
      const response = await fetch("/api/event", {
        method: "GET",
      });
      if (response.status === 200) {
        const { events } = await response.json();
        setEvents(events);
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
      <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>
      <div className="grid grid-cols-3 items-center gap-4">
        {events &&
          events.map((e, i) => {
            return (
              <div key={i} className="h-[40rem] overflow-hidden p-4 relative group transition rounded-xl">
                {/* <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-t to-slate-300 group-hover:opacity-60 opacity-0 from-transparent rounded-t-xl transition" /> */}
                {/* <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-300 group-hover:opacity-60 opacity-0 to-transparent rounded-b-xl  transition" /> */}
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}${process.env.NEXT_PUBLIC_STORAGE_PATH}/event-image/${e.id}/${e.image_id}`}
                  alt={`store ${i} image`}
                  fill={true}
                  className="object-cover -z-50 group-hover:scale-105 transition ease-in-out duration-300"
                />

                <div className="group-hover:opacity-100 opacity-0 transition absolute top-0 left-0 p-4 w-full flex">
                  <Badge variant="secondary" className="font-light">
                    {e.location}
                  </Badge>
                  <Badge variant="secondary" className="ml-auto font-light">
                    {e.datetime}
                  </Badge>
                </div>

                <div className="group-hover:opacity-100 opacity-0 transition absolute bottom-0 left-0 p-4 w-full flex flex-col items-start">
                  <Badge className="text-2xl font-semibold">{e.name}</Badge>
                  {/* <p className="px-4 py-2 bg-black text-white text-sm">{e.description}</p> */}
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
};

export default EventsPage;
