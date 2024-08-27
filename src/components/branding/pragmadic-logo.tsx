import Image from "next/image";
import React from "react";

export default function PragmadicLogo({ className }: { className?: string }) {
  return (
    <div className="m-auto flex items-center justify-center gap-2 rounded-3xl bg-accent bg-logo p-2 shadow dark:bg-logo">
      <Image src="/pragmadic.svg" width="36" height="36" alt="PRAGmadic Logo" />
      <div className={``}>
        <span className="text-center font-solway text-2xl font-normal leading-normal text-amber-700">
          pragmadic
        </span>
      </div>
    </div>
  );
}
