import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { MonthlySummaryResponse, MonthlySummaryData } from "@/types/api";
import {
    Calendar,
    Clock,
    Users,
    AlertCircle,
    TrendingUp,
    BarChart3,
} from "lucide-react";

interface MonthlySummaryProps {
    month?: string;
}

export function MonthlySummary({ month }: MonthlySummaryProps) {
    const [summary, setSummary] = useState<MonthlySummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSummary();
    }, [month]);

    const fetchSummary = async () => {
        try {
            setLoading(true);
            const response = await axios.get<MonthlySummaryResponse>(
                `/api/v1/leave/summary${month ? `?month=${month}` : ""}`
            );

            if (response.data.success && response.data.data) {
                setSummary(response.data.data);
            } else {
                setError("Failed to fetch summary data");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Summary</CardTitle>
                    <CardDescription>Loading summary data...</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoadingSkeleton className="h-4 w-full mb-2" />
                    <LoadingSkeleton className="h-4 w-3/4 mb-2" />
                    <LoadingSkeleton className="h-4 w-1/2" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Summary</CardTitle>
                    <CardDescription>Error loading data</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }

    if (!summary) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Summary</CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {summary.month} Leave Analytics
                </h2>
                <p className="text-gray-600">
                    Comprehensive insights into your team's leave patterns
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">
                                Total Requests
                            </p>
                            <p className="text-3xl font-bold">
                                {summary.total_requests}
                            </p>
                        </div>
                        <Calendar className="h-8 w-8 text-blue-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">
                                Total Days
                            </p>
                            <p className="text-3xl font-bold">
                                {summary.total_days_requested}
                            </p>
                        </div>
                        <Clock className="h-8 w-8 text-green-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">
                                Team Members
                            </p>
                            <p className="text-3xl font-bold">
                                {summary.team_stats.total_employees}
                            </p>
                        </div>
                        <Users className="h-8 w-8 text-purple-200" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">
                                Avg Days
                            </p>
                            <p className="text-3xl font-bold">
                                {summary.team_stats.average_days_per_request.toFixed(
                                    1
                                )}
                            </p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-orange-200" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            Status Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(summary.status_summary).map(
                                ([status, data]) => (
                                    <div
                                        key={status}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-semibold capitalize text-gray-900">
                                                {status}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {data.total_days} days total
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-600">
                                                {data.count}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                requests
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Type Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            Leave Types
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(summary.type_summary).map(
                                ([type, data]) => (
                                    <div
                                        key={type}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-semibold capitalize text-gray-900">
                                                {type}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {data.total_days} days total
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-600">
                                                {data.count}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                requests
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Team Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        Team Insights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">
                                {summary.team_stats.total_employees}
                            </p>
                            <p className="text-sm text-gray-600">
                                Total Employees
                            </p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">
                                {summary.team_stats.employees_with_leave}
                            </p>
                            <p className="text-sm text-gray-600">
                                With Leave Requests
                            </p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">
                                {summary.team_stats.most_common_leave_type ||
                                    "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                                Most Common Type
                            </p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <p className="text-2xl font-bold text-orange-600">
                                {summary.team_stats.average_days_per_request.toFixed(
                                    1
                                )}
                            </p>
                            <p className="text-sm text-gray-600">
                                Avg Days/Request
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Daily Schedule */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                        This Week's Leave Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {summary.daily_breakdown.slice(0, 7).map((day) => (
                            <div
                                key={day.date}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {day.day_name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {day.date}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-indigo-600">
                                        {day.on_leave_count}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        on leave
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
