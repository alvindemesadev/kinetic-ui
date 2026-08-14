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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Atom, Settings2, Triangle } from "lucide-react";

import { DemoBlock } from "./DemoBlock";

export function CatalogForms({
  completion,
  setCompletion,
  framework,
  setFramework,
}: {
  completion: number[];
  setCompletion: (value: number[]) => void;
  framework: string;
  setFramework: (value: string) => void;
}) {
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

      <DemoBlock title="OTP & popover">
        <div className="catalog-date-otp-row">
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
