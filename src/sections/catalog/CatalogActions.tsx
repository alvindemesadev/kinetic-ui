import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Spinner } from "@/components/ui/spinner";
import { Info } from "lucide-react";

import { DemoBlock } from "./DemoBlock";

export function CatalogActions() {
  return (
    <>
      <DemoBlock title="Actions, feedback & loading">
        <div className="flex flex-wrap items-center gap-2">
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
    </>
  );
}
