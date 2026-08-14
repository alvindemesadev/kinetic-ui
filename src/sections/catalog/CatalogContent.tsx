import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { FileText, Inbox, Mail, Bold } from "lucide-react";

import { DemoBlock } from "./DemoBlock";

export function CatalogContent() {
  return (
    <>
      <DemoBlock title="Inputs, toggles & identity">
        <span className="auth-input-shell catalog-email-input">
          <Mail size={15} aria-hidden="true" />
          <input aria-label="Email address" type="email" autoComplete="email" placeholder="you@example.com" />
        </span>
        <div className="catalog-identity-toolbar">
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>KM</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
          <div className="catalog-identity-actions">
            <Toggle
              className="catalog-identity-format-toggle"
              variant="outline"
              aria-label="Bold"
              title="Bold"
            >
              <Bold />
            </Toggle>
            <ToggleGroup type="single" defaultValue="left">
              <ToggleGroupItem value="left">Left</ToggleGroupItem>
              <ToggleGroupItem value="right">Right</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="Content & empty states">
        <ItemGroup>
          <Item role="listitem" variant="outline">
            <ItemMedia variant="icon">
              <FileText />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>component-library.tsx</ItemTitle>
              <ItemDescription>Updated just now</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="outline">Active</Badge>
            </ItemActions>
          </Item>
        </ItemGroup>
        <Empty className="mt-4 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>No archived items</EmptyTitle>
            <EmptyDescription>Items you archive will appear here.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline">Create item</Button>
          </EmptyContent>
        </Empty>
      </DemoBlock>

      <DemoBlock title="Layout, carousel & scrolling">
        <ResizablePanelGroup orientation="horizontal" className="catalog-resizable">
          <ResizablePanel defaultSize={45}>
            <div className="catalog-resizable-pane">Navigation</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55}>
            <div className="catalog-resizable-pane">Content</div>
          </ResizablePanel>
        </ResizablePanelGroup>
        <ScrollArea
          tabIndex={0}
          aria-label="Scrollable component rows"
          className="mt-4 h-28 rounded-lg border p-3"
        >
          <div className="space-y-2">
            {Array.from({ length: 8 }, (_, index) => (
              <p key={index}>Scrollable component row {index + 1}</p>
            ))}
          </div>
        </ScrollArea>
        <Carousel className="mx-10 mt-5">
          <CarouselContent>
            {[1, 2, 3].map((item) => (
              <CarouselItem key={item}>
                <AspectRatio ratio={3 / 1} className="flex items-center justify-center rounded-lg bg-muted">
                  <strong>Slide {item}</strong>
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DemoBlock>
    </>
  );
}
