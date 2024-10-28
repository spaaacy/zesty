import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const { id } = await res.params;
    const { data, error } = await supabase.rpc("check_if_store_owner", {
      p_store_id: id,
    });
    if (error) throw error;
    return NextResponse.json({ isOwner: data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
