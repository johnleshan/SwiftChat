
import type { SuggestFocusModeOutput } from "@/ai/flows/suggest-focus-mode";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Zap } from "lucide-react";

interface FocusModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: SuggestFocusModeOutput;
  onConfirm: () => void;
}

export function FocusModeDialog({ open, onOpenChange, suggestion, onConfirm }: FocusModeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <Zap className="h-6 w-6 text-accent-foreground" />
          </div>
          <AlertDialogTitle className="text-center font-headline">Enable Focus Mode?</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            It looks like the conversation is centering around{" "}
            <strong className="text-primary">{suggestion.suggestedTopic}</strong>.
            <br />
            Would you like to enter Focus Mode to hide other topics and improve concentration?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel>Not Now</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            <Zap className="mr-2 h-4 w-4" />
            Enter Focus Mode
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
