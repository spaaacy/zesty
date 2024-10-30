"use client";

import { UserContext } from "@/context/UserContext";
import { supabase } from "@/utils/supabase";
import { Modak } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { Button, buttonVariants } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import UserAvatar from "./UserAvatar";

const modak = Modak({
  subsets: ["latin"],
  weight: "400",
});

const NavBar = () => {
  const { session, user } = useContext(UserContext);
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
      <NavigationMenu className="flex items-center py-4 max-w-[108rem] mx-auto px-8">
        <Link href="/" className="flex items-center justify-center">
          <span className={`${modak.className} font-bold text-4xl ml-2 text-[#facc15] bg-black px-4 py-1 rounded-full`}>
            zesty
          </span>
        </Link>

        <NavigationMenuList className="ml-12 gap-2">
          <NavigationMenuItem>
            <Link href="/stores" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Stores</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/events" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Events</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>

        <div className="ml-auto flex gap-2 justify-center items-center">
          {showSignIn && (
            <div>
              {session?.data.session ? (
                <div className="gap-2 flex items-center justify-center">
                  {user?.admin && pathname === "/events" && (
                    <Link href="/events/create" className={buttonVariants()}>
                      Create Event
                    </Link>
                  )}
                  {pathname === "/stores" && (
                    <Link href="/stores/create" className={buttonVariants()}>
                      Start Selling
                    </Link>
                  )}
                  <Button onClick={signOut} variant="outline" className="mr-4">
                    Sign Out
                  </Button>
                  {user && <UserAvatar size={40} username={user.email} />}
                </div>
              ) : (
                <Link href="/signin" className={buttonVariants({ variant: "outline" })}>
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </NavigationMenu>
    </nav>
  );
};

export default NavBar;
