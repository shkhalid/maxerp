import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
    status: "approved" | "rejected" | "pending";
    showIcon?: boolean;
    className?: string;
}

/**
 * Reusable status badge component for leave request statuses
 */
export function StatusBadge({
    status,
    showIcon = true,
    className,
}: StatusBadgeProps): JSX.Element {
    const statusConfig = {
        approved: {
            icon: CheckCircle,
            text: "Approved",
            className: "bg-green-100 text-green-800 border-green-200",
        },
        rejected: {
            icon: XCircle,
            text: "Rejected",
            className: "bg-red-100 text-red-800 border-red-200",
        },
        pending: {
            icon: Clock,
            text: "Pending",
            className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                config.className,
                className
            )}
        >
            {showIcon && <Icon className="w-3 h-3" />}
            {config.text}
        </span>
    );
}
