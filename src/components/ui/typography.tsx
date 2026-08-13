import * as React from "react";

import { cn } from "@/lib/utils";

function TypographyH1({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight text-balance", className)} {...props} />
  );
}

function TypographyH2({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function TypographyH3({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props} />;
}

function TypographyP({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />;
}

function TypographyLead({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-xl text-muted-foreground", className)} {...props} />;
}

function TypographySmall({ className, ...props }: React.ComponentProps<"small">) {
  return <small className={cn("text-sm leading-none font-medium", className)} {...props} />;
}

function TypographyMuted({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function TypographyBlockquote({ className, ...props }: React.ComponentProps<"blockquote">) {
  return <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props} />;
}

function TypographyCode({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      className={cn("rounded bg-muted px-1.5 py-1 font-mono text-sm font-semibold", className)}
      {...props}
    />
  );
}

export {
  TypographyBlockquote,
  TypographyCode,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyLead,
  TypographyMuted,
  TypographyP,
  TypographySmall,
};
