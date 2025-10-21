import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
    className?: string;
    count?: number;
}

/**
 * Reusable loading skeleton component for loading states
 */
export function LoadingSkeleton({
    className,
    count = 1,
}: LoadingSkeletonProps): JSX.Element {
    if (count === 1) {
        return (
            <div
                className={cn("animate-pulse bg-gray-200 rounded", className)}
            />
        );
    }

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        "animate-pulse bg-gray-200 rounded",
                        className
                    )}
                />
            ))}
        </>
    );
}

/**
 * Card skeleton for loading states
 */
export function CardSkeleton({
    className,
}: {
    className?: string;
}): JSX.Element {
    return (
        <div className={cn("border rounded-lg p-6", className)}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                        <div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2" />
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-28" />
                    </div>
                </div>
                <div className="flex space-x-2 ml-4">
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
                </div>
            </div>
        </div>
    );
}
