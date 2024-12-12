"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ButtonDemo() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Button
      className="group"
      variant="outline"
      size="icon"  
    >
    
    </Button>
  );
}
