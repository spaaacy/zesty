import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { v4 as uuidv4 } from "uuid";

export async function POST(req, res) {
  try {
    const access_token = req.headers.get("x-supabase-auth").split(" ")[0];
    const refresh_token = req.headers.get("x-supabase-auth").split(" ")[1];
    if (!access_token || !refresh_token) throw Error("You must be authorized to do this action!");
    const auth = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (auth.error) throw auth.error;

    const formData = await req.formData();
    const store = JSON.parse(formData.get("store"));
    const image = formData.get("image");
    const imageId = uuidv4();
    const storeId = uuidv4();

    // const product = await stripe.products.create({ name: store.name });

    let results = await supabase.from("store").insert({ ...store, id: storeId, image_id: imageId });
    if (results.error) throw results.error;

    results = await supabase.storage.from("store-image").upload(`${storeId}/${imageId}`, image, {
      cacheControl: 3600,
      upsert: true,
    });
    if (results.error) throw results.error;

    return NextResponse.json({ message: "Store created successfully!", storeId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
