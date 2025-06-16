import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils"; // Pastikan kamu punya util `cn` atau hapus jika tidak perlu

export function Dialog({ children, ...props }) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

export function DialogTrigger({ children, ...props }) {
  return <DialogPrimitive.Trigger {...props}>{children}</DialogPrimitive.Trigger>;
}

export function DialogContent({ children, className, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-40" />
      <DialogPrimitive.Content
        className={cn("fixed z-50 p-6 bg-white rounded-lg shadow-lg w-full max-w-lg top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2", className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-2 right-2">
          <X className="w-5 h-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-bold">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}