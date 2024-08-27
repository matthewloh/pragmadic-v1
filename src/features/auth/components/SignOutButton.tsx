"use client";

import { signout } from "@/features/auth/auth-actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { LogOut, LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

export function SignOut() {
  const [isLoading, setLoading] = useState(false);
  const params = usePathname();
  const next = params ?? "";
  const handleSignOut = async () => {
    toast.info("Signing out...", {
      description: `You will be redirected to the login page from ${params}`,
      duration: 3000,
      icon: <LogOut />,
    });
    setLoading(true);
    signout({ next });
  };

  return (
    <DropdownMenuItem onClick={handleSignOut}>
      <LogOutIcon className="size-4 mr-2" />
      {isLoading ? "Loading..." : "Sign out"}
    </DropdownMenuItem>
  );
}
