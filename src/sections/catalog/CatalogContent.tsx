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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Bold, FileText, Inbox, Mail } from "lucide-react";

import { DemoBlock } from "./DemoBlock";

export function CatalogContent() {
  return (
    <>
      <DemoBlock title="Inputs, toggles & identity">
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>
              <Mail /> Email
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput aria-label="Email address" placeholder="alvin@example.com" />
        </InputGroup>
        <div className="mt-4 flex items-center justify-between gap-4">
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>KM</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
          <div className="flex gap-2">
            <Toggle variant="outline" aria-label="Bold" title="Bold">
              <Bold />
            </Toggle>
            <ToggleGroup type="single" defaultValue="left">
              <ToggleGroupItem value="left">Left</ToggleGroupItem>
              <ToggleGroupItem value="right">Right</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </DemoBlock>

      <DemoBlock title="Content, messages & empty states">
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
        <MessageGroup className="mt-4">
          <Message>
            <MessageAvatar>AD</MessageAvatar>
            <MessageContent>
              <MessageHeader>Alvin</MessageHeader>
              <div className="message-bubble">These components now live in the template.</div>
              <MessageFooter>Just now</MessageFooter>
            </MessageContent>
          </Message>
          <Message align="end">
            <MessageAvatar>AD</MessageAvatar>
            <MessageContent>
              <MessageHeader>Alvin</MessageHeader>
              <div className="message-bubble">The kinetic skin keeps them tactile too.</div>
              <MessageFooter>Just now</MessageFooter>
            </MessageContent>
          </Message>
        </MessageGroup>
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

      <DemoBlock title="Table & structured data">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Usage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Button</TableCell>
              <TableCell>
                <Badge variant="outline">Stable</Badge>
              </TableCell>
              <TableCell className="text-right">24</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Dialog</TableCell>
              <TableCell>
                <Badge variant="secondary">Updated</Badge>
              </TableCell>
              <TableCell className="text-right">12</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Collapsible className="mt-4">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              Show implementation note
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 text-sm text-muted-foreground">
            The table, collapsible region, and controls above are the real exported components.
          </CollapsibleContent>
        </Collapsible>
      </DemoBlock>
    </>
  );
}
