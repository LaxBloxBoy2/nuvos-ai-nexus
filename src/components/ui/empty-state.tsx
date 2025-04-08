
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        {icon && <div className="mb-4 text-gray-300">{icon}</div>}
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        {description && (
          <p className="text-gray-500 text-sm max-w-md mb-4">{description}</p>
        )}
        {action && (
          <Button onClick={action.onClick} className="bg-nuvos-teal hover:bg-nuvos-teal/90">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
