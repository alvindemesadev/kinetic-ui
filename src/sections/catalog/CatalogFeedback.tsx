import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TypographyCode } from "@/components/ui/typography";

import { DemoBlock } from "./DemoBlock";

export function CatalogFeedback() {
  return (
    <>
      <DemoBlock title="Loading & typography">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Progress value={68} aria-label="Loading progress" />
          <p className="text-sm text-muted-foreground">
            Use <TypographyCode>npm run check</TypographyCode> before shipping. <Kbd>Ctrl K</Kbd>
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="mt-4" variant="outline">
                Hover for details
              </Button>
            </TooltipTrigger>
            <TooltipContent className="sidebar-matched-tooltip">Accessible tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DemoBlock>
    </>
  );
}
