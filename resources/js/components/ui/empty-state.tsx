import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

/**
 * Reusable empty state component for when lists are empty
 */
export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps): JSX.Element {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-12 text-center",
                className
            )}
        >
            {icon && (
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-4">{description}</p>
            {action && (
                <Button
                    onClick={action.onClick}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
}
