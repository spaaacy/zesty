import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const access_token = req.headers.get("x-supabase-auth").split(" ")[0];
    const refresh_token = req.headers.get("x-supabase-auth").split(" ")[1];
    if (!access_token || !refresh_token) throw Error("You must be authorized to do this action!");
    const auth = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (auth.error) throw auth.error;

    const { id } = await res.params;
    const { data, error } = await supabase.from("product").select().eq("store_id", id);
    if (error) throw error;
    return NextResponse.json({ products: data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
