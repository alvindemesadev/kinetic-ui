import {
  Atom,
  Bell,
  Bold,
  ChevronRight,
  FileText,
  Inbox,
  Info,
  Mail,
  MoreHorizontal,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  Triangle,
} from "lucide-react";
import { useState } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TypographyCode, TypographyH3, TypographyMuted } from "@/components/ui/typography";

function DemoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="catalog-demo-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function ComponentCatalog() {
  const [date, setDate] = useState<Date>();
  const [enabled, setEnabled] = useState(true);
  const [completion, setCompletion] = useState([62]);
  const [framework, setFramework] = useState("react");

  return (
    <div className="catalog-shell" aria-label="Skeuomorphic component library">
      <div className="catalog-summary">
        <div>
          <Badge variant="secondary">Reusable primitives</Badge>
          <TypographyH3>Skeuomorphic component library</TypographyH3>
          <TypographyMuted>
            Working, keyboard-accessible components styled with the same physical materials as the template.
          </TypographyMuted>
        </div>
      </div>

      <div className="catalog-demo-grid">
        <DemoBlock title="Actions & feedback">
          <div className="flex flex-wrap items-center gap-2">
            <Button>
              <Sparkles /> Primary
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <ButtonGroup>
              <Button variant="outline">Back</Button>
              <Button variant="outline">Next</Button>
            </ButtonGroup>
            <Spinner />
          </div>
          <Alert className="mt-4">
            <Info />
            <AlertTitle>Action completed</AlertTitle>
            <AlertDescription>
              Alerts, badges, buttons, and feedback share the template's tactile treatment.
            </AlertDescription>
          </Alert>
        </DemoBlock>

        <DemoBlock title="Form controls">
          <div className="catalog-form-grid">
            <div className="catalog-field">
              <Label htmlFor="catalog-name">Project name</Label>
              <Input id="catalog-name" placeholder="Kinetic UI" />
            </div>
            <div className="catalog-field">
              <Label htmlFor="catalog-framework">Framework</Label>
              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger id="catalog-framework" aria-label="Framework">
                  <SelectValue>{framework === "react" ? "React" : "Vue"}</SelectValue>
                </SelectTrigger>
                <SelectContent className="catalog-framework-menu" position="popper" align="start">
                  <SelectItem value="react" textValue="React">
                    <span className="catalog-framework-option">
                      <span className="catalog-framework-icon react">
                        <Atom />
                      </span>
                      <span>
                        <strong>React</strong>
                        <small>Component UI library</small>
                      </span>
                    </span>
                  </SelectItem>
                  <SelectItem value="vue" textValue="Vue">
                    <span className="catalog-framework-option">
                      <span className="catalog-framework-icon vue">
                        <Triangle />
                      </span>
                      <span>
                        <strong>Vue</strong>
                        <small>Progressive UI framework</small>
                      </span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="catalog-selection-controls">
              <div className="catalog-control-row">
                <span>
                  <Label htmlFor="catalog-sync">Sync automatically</Label>
                  <small>Keep component changes synchronized.</small>
                </span>
                <Checkbox id="catalog-sync" aria-label="Sync automatically" defaultChecked />
              </div>
              <RadioGroup
                defaultValue="balanced"
                className="catalog-radio-group"
                aria-label="Performance mode"
              >
                <div className="catalog-control-row">
                  <span>
                    <Label htmlFor="catalog-balanced">Balanced performance</Label>
                    <small>Best mix of speed and battery use.</small>
                  </span>
                  <RadioGroupItem value="balanced" id="catalog-balanced" aria-label="Balanced performance" />
                </div>
                <div className="catalog-control-row">
                  <span>
                    <Label htmlFor="catalog-fast">Maximum performance</Label>
                    <small>Prioritize speed for intensive work.</small>
                  </span>
                  <RadioGroupItem value="fast" id="catalog-fast" aria-label="Maximum performance" />
                </div>
              </RadioGroup>
              <div className="catalog-control-row catalog-switch-row">
                <span>
                  <Label htmlFor="catalog-enabled">Notifications</Label>
                  <small>Desktop alerts and sounds.</small>
                </span>
                <Switch
                  id="catalog-enabled"
                  aria-label="Notifications"
                  checked={enabled}
                  onCheckedChange={setEnabled}
                />
              </div>
            </div>
            <div className="catalog-slider-field">
              <span>
                <Label>Completion</Label>
                <small>Adjust the current progress target.</small>
              </span>
              <div className="catalog-slider-control">
                <Slider value={completion} onValueChange={setCompletion} max={100} aria-label="Completion" />
                <output aria-live="polite">{completion[0]}%</output>
              </div>
            </div>
            <Textarea placeholder="Add a description..." className="catalog-form-textarea" />
          </div>
        </DemoBlock>

        <DemoBlock title="Date, OTP & popover">
          <div className="flex flex-wrap items-center gap-3">
            <DatePicker value={date} onChange={setDate} />
            <InputOTP maxLength={4} aria-label="Verification code">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Settings2 /> Details
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>Component settings</PopoverTitle>
                  <PopoverDescription>Popover content is portalled and theme-aware.</PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          </div>
        </DemoBlock>

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
          <ToggleGroup type="multiple" variant="outline" aria-label="Notification channels">
            <ToggleGroupItem value="alerts" aria-label="Alerts">
              <Bell /> Alerts
            </ToggleGroupItem>
            <ToggleGroupItem value="updates" aria-label="Updates">
              Updates
            </ToggleGroupItem>
          </ToggleGroup>
        </DemoBlock>

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
              <TooltipContent>Accessible tooltip content</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DemoBlock>

        <DemoBlock title="Dialogs, sheets & drawers">
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Edit profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>Update the details shown to your team.</DialogDescription>
                </DialogHeader>
                <div className="portal-form-field">
                  <Label htmlFor="dialog-display-name">Display name</Label>
                  <Input id="dialog-display-name" defaultValue="Alvin de Mesa" />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button>Save changes</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open settings</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Workspace settings</SheetTitle>
                  <SheetDescription>Manage preferences without leaving the page.</SheetDescription>
                </SheetHeader>
                <div className="portal-setting-list">
                  <div className="portal-setting-row">
                    <span>
                      <strong>Notifications</strong>
                      <small>Desktop alerts and sounds</small>
                    </span>
                    <Switch aria-label="Sheet notifications" checked={enabled} onCheckedChange={setEnabled} />
                  </div>
                  <div className="portal-setting-row">
                    <span>
                      <strong>Automatic updates</strong>
                      <small>Install stable releases automatically</small>
                    </span>
                    <Switch aria-label="Automatic updates" defaultChecked />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button>Save settings</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Open drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Quick actions</DrawerTitle>
                  <DrawerDescription>A touch-friendly action surface.</DrawerDescription>
                </DrawerHeader>
                <div className="drawer-action-grid">
                  <Button variant="outline">
                    <Sparkles /> New project
                  </Button>
                  <Button variant="outline">
                    <FileText /> Upload file
                  </Button>
                  <Button variant="outline">
                    <Mail /> Invite teammate
                  </Button>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button>Done</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <Trash2 />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                  <AlertDialogDescription>This demonstration keeps the action local.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="overlay-type-grid" aria-label="Overlay component types">
            <span>
              <strong>Dialog</strong>
              <small>Focused editing</small>
            </span>
            <span>
              <strong>Sheet</strong>
              <small>Side settings</small>
            </span>
            <span>
              <strong>Drawer</strong>
              <small>Touch actions</small>
            </span>
            <span>
              <strong>Alert</strong>
              <small>Confirm danger</small>
            </span>
          </div>
        </DemoBlock>

        <DemoBlock title="Menus, search & selection">
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal /> Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Workspace</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Select defaultValue="comfortable">
              <SelectTrigger className="w-44" aria-label="Density">
                <SelectValue placeholder="Choose density" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline">Hover profile</Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <strong>Alvin de Mesa</strong>
                <p className="text-muted-foreground">Product developer building Kinetic UI.</p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <Command className="catalog-command mt-4 h-auto! w-full">
            <CommandInput placeholder="Search commands..." />
            <CommandList>
              <CommandEmpty>No command found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <Search /> Search components
                </CommandItem>
                <CommandItem>
                  <Settings2 /> Open settings
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DemoBlock>

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
                <AvatarBadge />
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
                <div className="rounded-lg bg-muted px-3 py-2">
                  These components now live in the template.
                </div>
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
      </div>
    </div>
  );
}
