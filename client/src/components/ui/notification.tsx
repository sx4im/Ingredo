import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface NotificationProps {
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    className: "border-green-200 bg-green-50 text-green-800",
    iconClassName: "text-green-600"
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-800",
    iconClassName: "text-red-600"
  },
  warning: {
    icon: AlertTriangle,
    className: "border-yellow-200 bg-yellow-50 text-yellow-800",
    iconClassName: "text-yellow-600"
  },
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-800",
    iconClassName: "text-blue-600"
  }
};

export function Notification({
  type = "info",
  title,
  message,
  onClose,
  action,
  className
}: NotificationProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card className={cn("border-l-4", config.className, className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconClassName)} />
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-medium text-sm mb-1">{title}</h4>
            )}
            <p className="text-sm">{message}</p>
            {action && (
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
          </div>
          {onClose && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 flex-shrink-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface NotificationContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function NotificationContainer({ children, className }: NotificationContainerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
}
