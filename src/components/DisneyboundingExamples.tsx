import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import example1 from "@/assets/disneybounding-3.jpg";
import example2 from "@/assets/disneybounding-4.jpg";
import { useState } from "react";

const DisneyboundingExamples = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-3 text-xs text-teal underline underline-offset-2 hover:no-underline"
      >
        See examples →
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-navy">
              Disneybounding Examples
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <figure className="space-y-2">
              <img
                src={example1}
                alt="Disneybounding example"
                className="w-full rounded-lg object-cover"
              />
            </figure>
            <figure className="space-y-2">
              <img
                src={example2}
                alt="Disneybounding example"
                className="w-full rounded-lg object-cover"
              />
            </figure>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DisneyboundingExamples;
