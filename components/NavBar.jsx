"use client";

import { UserContext } from "@/context/UserContext";
import { supabase } from "@/utils/supabase";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { Button, buttonVariants } from "./ui/button";

const NavBar = () => {
  const { session } = useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname();
  const showSignIn = pathname !== "/signin" && pathname !== "/signup";

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      location.reload();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav>
      <div className="flex items-center py-2 px-8">
        <Link href="/" className="flex items-center justify-center">
          <span className="font-semibold text-2xl ml-2">Zesty</span>
        </Link>

        <div className="ml-auto flex gap-2 justify-center items-center">
          {showSignIn && (
            <div>
              {session?.data.session ? (
                <Button onClick={signOut} variant="outline">
                  Sign Out
                </Button>
              ) : (
                <Link href="/signin" className={buttonVariants({ variant: "outline" })}>
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
