import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { useCurrentUser } from "../hooks/use-current-user";
import { Loader } from "lucide-react";
import { SignOut } from "./SignOutButton";

export default function UserButton() {
  const { data, isLoading, isFetching } = useCurrentUser();

  if (isLoading || isFetching) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  }
  if (!data) {
    return null;
  }
  console.log(data);
  const { display_name, image_url, email } = data;
  if (!display_name) {
    return null;
  }
  if (!image_url) {
    return null;
  }
  const avatarFallback = display_name!.charAt(0).toUpperCase();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage alt={display_name} src={image_url} />
          <AvatarFallback>
            <span className="text-primary">{avatarFallback}</span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuLabel>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="truncate">{display_name}</span>
              <span className="truncate text-xs text-[#606060] font-normal">
                {email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem></DropdownMenuItem>
        <DropdownMenuSeparator />
        <SignOut />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
