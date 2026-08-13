import { useState } from "react";
import { format } from "date-fns";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatePicker as KineticDatePicker } from "@/components";
import { Atom, Settings2, Triangle } from "lucide-react";

import { DemoBlock } from "./DemoBlock";

export function CatalogForms({
  date,
  setDate,
  enabled,
  setEnabled,
  completion,
  setCompletion,
  framework,
  setFramework,
}: {
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  completion: number[];
  setCompletion: (value: number[]) => void;
  framework: string;
  setFramework: (value: string) => void;
}) {
  const [dateOpen, setDateOpen] = useState(false);
  const dateValue = date ? format(date, "yyyy-MM-dd") : "";

  return (
    <>
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
            <RadioGroup defaultValue="balanced" className="catalog-radio-group" aria-label="Performance mode">
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
          <div className="catalog-date-picker">
            <KineticDatePicker
              value={dateValue}
              onChange={(nextValue) => setDate(nextValue ? new Date(`${nextValue}T00:00:00`) : undefined)}
              isOpen={dateOpen}
              onToggle={() => setDateOpen((current) => !current)}
              onClose={() => setDateOpen(false)}
            />
          </div>
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
    </>
  );
}
