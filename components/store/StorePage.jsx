"use client";

import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Loader from "../common/Loader";
import { UserContext } from "@/context/UserContext";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const StorePage = () => {
  const { session } = useContext(UserContext);
  const params = useParams();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState();

  useEffect(() => {
    if (!dataLoaded && session) {
      setDataLoaded(true);
      loadStore();
    }
  }, [session]);

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
              <div className="relative h-[16rem] drop-shadow-lg text-white p-4">
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
                <div className="flex flex-col w-44">
                  <h4 className="mt-4 text-lg font-bold">Store Details</h4>
                  <p className="text-sm text-gray-800 font-normal">{store.description}</p>
                  <p className="text-sm text-gray-800 font-normal mt-2">
                    <span className="font-semibold">Unit No.: </span>
                    {store.unit_number}
                  </p>
                  <p className="text-sm text-gray-800 font-normal  ">
                    <span className="font-semibold">Contact Number: </span>
                    {store.contact_number}
                  </p>
                </div>

                <div className="flex-1">
                  <h2 className="mt-4 text-3xl font-bold mb-4">Products</h2>

                  <ul className="flex flex-col gap-4">
                    {products.map((p, i) => {
                      return (
                        <Card key={i}>
                          <CardHeader className="flex-row justify-between items-center w-full">
                            <CardTitle>{p.name}</CardTitle>
                            <p>{`$${p.price}`}</p>
                          </CardHeader>
                          <CardContent>{p.description}</CardContent>
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

const products = [
  {
    name: "Classic Margherita Pizza",
    description: "A traditional Italian pizza topped with fresh tomatoes, mozzarella cheese, and basil.",
    price: 12.99,
  },
  {
    name: "Spicy Tuna Roll",
    description: "A sushi roll filled with spicy tuna, avocado, and cucumber, topped with sesame seeds.",
    price: 8.49,
  },
  {
    name: "BBQ Chicken Wings",
    description: "Juicy chicken wings smothered in tangy BBQ sauce, served with a side of ranch.",
    price: 10.99,
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine lettuce tossed with Caesar dressing, croutons, and Parmesan cheese.",
    price: 7.49,
  },
  {
    name: "Vegan Burrito Bowl",
    description: "A healthy bowl with rice, black beans, avocado, and grilled veggies, topped with salsa.",
    price: 9.99,
  },
  {
    name: "Grilled Salmon",
    description: "Freshly grilled salmon served with a side of steamed vegetables and lemon butter sauce.",
    price: 15.99,
  },
  {
    name: "Avocado Toast",
    description: "Smashed avocado on toasted sourdough bread, topped with cherry tomatoes and feta.",
    price: 6.99,
  },
  {
    name: "Chocolate Chip Cookies",
    description: "Soft and chewy cookies loaded with chocolate chips, perfect for a sweet treat.",
    price: 3.49,
  },
  {
    name: "Penne Alfredo Pasta",
    description: "Creamy Alfredo sauce over penne pasta, garnished with parsley and Parmesan cheese.",
    price: 11.49,
  },
  {
    name: "Fruit Smoothie",
    description: "A refreshing smoothie blend of strawberries, bananas, and orange juice.",
    price: 5.99,
  },
];
