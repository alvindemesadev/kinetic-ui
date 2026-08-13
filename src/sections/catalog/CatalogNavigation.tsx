import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TypographyMuted } from "@/components/ui/typography";
import { Bell, ChevronRight } from "lucide-react";

import { DemoBlock } from "./DemoBlock";

export function CatalogNavigation() {
  return (
    <>
      <DemoBlock title="Navigation">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#overview">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Components</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Tabs defaultValue="details" className="mt-5">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <TypographyMuted>Keyboard-aware tab navigation with managed focus.</TypographyMuted>
          </TabsContent>
          <TabsContent value="activity">
            <Progress value={72} aria-label="Activity completion" />
          </TabsContent>
        </Tabs>
        <Pagination className="mt-5">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#components" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#components" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#components">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#components" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </DemoBlock>

      <DemoBlock title="Disclosure & selection">
        <Accordion type="single" collapsible defaultValue="tokens">
          <AccordionItem value="tokens">
            <AccordionTrigger>Semantic tokens</AccordionTrigger>
            <AccordionContent>Kinetic colors feed the standard shadcn semantic variables.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="access">
            <AccordionTrigger>Accessible behavior</AccordionTrigger>
            <AccordionContent>
              Focus, keyboard controls, and ARIA semantics come from proven primitives.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Separator className="my-4" />
        <ToggleGroup
          type="multiple"
          variant="outline"
          spacing={1}
          defaultValue={["alerts"]}
          aria-label="Notification channels"
        >
          <ToggleGroupItem value="alerts" aria-label="Alerts">
            <Bell /> Alerts
          </ToggleGroupItem>
          <ToggleGroupItem value="updates" aria-label="Updates">
            Updates
          </ToggleGroupItem>
        </ToggleGroup>
      </DemoBlock>
    </>
  );
}
