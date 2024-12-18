import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const access_token = req.headers.get("x-supabase-auth")?.split(" ")[0];
    const refresh_token = req.headers.get("x-supabase-auth")?.split(" ")[1];
    if (access_token && refresh_token) {
      const auth = await supabase.auth.setSession({ access_token, refresh_token });
      if (auth.error) throw auth.error;
    }

    const { data, error } = await supabase.from("store").select();
    if (error) throw error;
    return NextResponse.json({ stores: data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
