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
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Switch } from "@/components/ui/switch";
import { FileText, Mail, MoreHorizontal, Plus, Search, Settings2, Trash2 } from "lucide-react";

import { DemoBlock } from "./DemoBlock";

export function CatalogOverlays({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}) {
  return (
    <>
      <DemoBlock title="Dialogs, sheets & drawers">
        <div className="catalog-overlay-actions flex flex-wrap gap-2">
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
                  <Plus /> New project
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
    </>
  );
}
