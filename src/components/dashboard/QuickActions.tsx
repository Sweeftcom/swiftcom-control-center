import { FlaskConical, MessageSquare, Pause, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { label: "Test Order", icon: FlaskConical, variant: "outline" as const },
  { label: "Bulk SMS All", icon: MessageSquare, variant: "outline" as const },
  { label: "Emergency Pause", icon: Pause, variant: "destructive" as const },
  { label: "Live Chat Dashboard", icon: MessagesSquare, variant: "outline" as const },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant={action.variant}
          className="gap-2"
        >
          <action.icon className="h-4 w-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
