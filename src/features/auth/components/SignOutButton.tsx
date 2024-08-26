"use client";

import { signout } from "@/features/auth/auth-actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { LogOut, LogOutIcon } from "lucide-react";
import { toast } from "sonner";

export function SignOut() {
  const [isLoading, setLoading] = useState(false);

  const handleSignOut = async () => {
    toast.info("Signing out...", {
      description: "You will be redirected to the login page.",
      duration: 3000,
      icon: <LogOut />,
    });
    setLoading(true);
    signout();
  };

  return (
    <DropdownMenuItem onClick={handleSignOut}>
      <LogOutIcon className="mr-2" />
      {isLoading ? "Loading..." : "Sign out"}
    </DropdownMenuItem>
  );
}
