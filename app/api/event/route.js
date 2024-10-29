import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const { data, error } = await supabase.from("event").select();
    if (error) throw error;
    return NextResponse.json({ events: data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
