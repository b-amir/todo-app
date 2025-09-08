"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      duration={3000}
      expand={false}
      visibleToasts={3}
      key="sonner-toaster"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-ink-900 group-[.toaster]:border group-[.toaster]:border-neutral-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-ink-600",
          actionButton:
            "group-[.toast]:bg-emerald-600 group-[.toast]:text-white group-[.toast]:hover:bg-emerald-700 group-[.toast]:active:bg-emerald-800 group-[.toast]:rounded-md group-[.toast]:h-8 group-[.toast]:px-3 group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:shadow-none",
          cancelButton:
            "group-[.toast]:bg-transparent group-[.toast]:text-ink-600 group-[.toast]:hover:text-ink-800 group-[.toast]:rounded-md group-[.toast]:h-8 group-[.toast]:px-3 group-[.toast]:text-xs group-[.toast]:font-medium",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
