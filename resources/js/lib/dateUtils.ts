/**
 * Utility functions for date formatting
 */

/**
 * Format a date string to a human-readable format
 * @param dateString - ISO date string or date string
 * @returns Formatted date string (e.g., "Oct 21, 2025")
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

/**
 * Format a date range to a human-readable format
 * @param startDate - Start date string
 * @param endDate - End date string
 * @param days - Number of days
 * @returns Formatted date range string (e.g., "Oct 21 - Oct 23, 2025 (3 days)")
 */
export function formatDateRange(
    startDate: string,
    endDate: string,
    days: number
): string {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // If same year, show: "Oct 21 - Oct 23, 2025"
    if (start.getFullYear() === end.getFullYear()) {
        const startFormatted = start.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
        const endFormatted = end.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        return `${startFormatted} - ${endFormatted} (${days} ${
            days === 1 ? "day" : "days"
        })`;
    }

    // If different years, show: "Oct 21, 2024 - Jan 15, 2025"
    const startFormatted = start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const endFormatted = end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    return `${startFormatted} - ${endFormatted} (${days} ${
        days === 1 ? "day" : "days"
    })`;
}

/**
 * Format a date to a relative time (e.g., "2 days ago", "in 3 days")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil(
        (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
        return "Today";
    } else if (diffInDays === 1) {
        return "Tomorrow";
    } else if (diffInDays === -1) {
        return "Yesterday";
    } else if (diffInDays > 0) {
        return `In ${diffInDays} days`;
    } else {
        return `${Math.abs(diffInDays)} days ago`;
    }
}

/**
 * Format a date to show day of week and date
 * @param dateString - ISO date string
 * @returns Formatted string (e.g., "Monday, Oct 21, 2025")
 */
export function formatDateWithDay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
