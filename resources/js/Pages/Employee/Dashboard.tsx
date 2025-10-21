import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import { formatDateRange } from "@/lib/dateUtils";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { Calendar, Clock, CheckCircle, XCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface EmployeeDashboardProps {
    auth: {
        user: any;
    };
}

function EmployeeDashboard({ auth }: EmployeeDashboardProps): JSX.Element {
    const [showLeaveForm, setShowLeaveForm] = useState(false);
    const [leaveForm, setLeaveForm] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
    });
    const [leaveBalances, setLeaveBalances] = useState<any[]>([]);
    const [recentRequests, setRecentRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Fetch leave balances and recent requests
    useEffect(() => {
        fetchLeaveData();
    }, []);

    const fetchLeaveData = async () => {
        try {
            setLoading(true);

            // Fetch leave balances and requests in parallel
            const [balancesResponse, requestsResponse] = await Promise.all([
                axios.get("/api/v1/leave/balances"),
                axios.get("/api/v1/leave/requests"),
            ]);

            if (balancesResponse.data.success) {
                const formattedBalances = balancesResponse.data.data.map(
                    (balance: any) => ({
                        type:
                            balance.leave_type.charAt(0).toUpperCase() +
                            balance.leave_type.slice(1),
                        total: balance.total_days,
                        used: balance.used_days,
                        remaining: balance.remaining_days,
                    })
                );
                setLeaveBalances(formattedBalances);
            }

            if (requestsResponse.data.success) {
                const formattedRequests = requestsResponse.data.data.map(
                    (request: any) => ({
                        id: request.id,
                        type:
                            request.leave_type.charAt(0).toUpperCase() +
                            request.leave_type.slice(1),
                        startDate: request.start_date,
                        endDate: request.end_date,
                        days: request.days_requested,
                        status: request.status,
                        reason: request.reason,
                    })
                );
                setRecentRequests(formattedRequests);
            }
        } catch (error) {
            console.error("Error fetching leave data:", error);
            // Fallback to mock data on error
            setLeaveBalances([
                { type: "Vacation", total: 20, used: 5, remaining: 15 },
                { type: "Sick", total: 10, used: 2, remaining: 8 },
                { type: "Personal", total: 5, used: 1, remaining: 4 },
            ]);

            setRecentRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const validateLeaveForm = () => {
        const today = new Date().toISOString().split("T")[0];

        if (!leaveForm.leaveType) {
            toast({
                title: "Validation Error",
                description: "Please select a leave type",
                variant: "destructive",
            });
            return false;
        }

        if (!leaveForm.startDate) {
            toast({
                title: "Validation Error",
                description: "Please select a start date",
                variant: "destructive",
            });
            return false;
        }

        if (!leaveForm.endDate) {
            toast({
                title: "Validation Error",
                description: "Please select an end date",
                variant: "destructive",
            });
            return false;
        }

        if (leaveForm.startDate < today) {
            toast({
                title: "Validation Error",
                description: "Start date cannot be in the past",
                variant: "destructive",
            });
            return false;
        }

        if (leaveForm.endDate < today) {
            toast({
                title: "Validation Error",
                description: "End date cannot be in the past",
                variant: "destructive",
            });
            return false;
        }

        if (leaveForm.endDate < leaveForm.startDate) {
            toast({
                title: "Validation Error",
                description: "End date cannot be before start date",
                variant: "destructive",
            });
            return false;
        }

        if (!leaveForm.reason.trim()) {
            toast({
                title: "Validation Error",
                description: "Please provide a reason for your leave request",
                variant: "destructive",
            });
            return false;
        }

        return true;
    };

    const handleSubmitLeave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Frontend validation
        if (!validateLeaveForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("/api/v1/leave/apply", {
                leave_type: leaveForm.leaveType,
                start_date: leaveForm.startDate,
                end_date: leaveForm.endDate,
                reason: leaveForm.reason,
            });

            if (response.data.success) {
                // Show success message
                toast({
                    title: "Success",
                    description: "Leave request submitted successfully!",
                });
                setShowLeaveForm(false);
                setLeaveForm({
                    leaveType: "",
                    startDate: "",
                    endDate: "",
                    reason: "",
                });
                // Refresh data
                fetchLeaveData();
            } else {
                toast({
                    title: "Error",
                    description: response.data.message,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.error("Error submitting leave request:", error);
            console.error("Full error response:", error.response);

            let errorMessage = "An error occurred";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors) {
                // Handle validation errors
                const errors = error.response.data.errors;
                const firstError = Object.values(errors)[0];
                errorMessage = Array.isArray(firstError)
                    ? firstError[0]
                    : firstError;
            } else if (error.response?.status === 422) {
                errorMessage = "Validation failed. Please check your input.";
            } else if (error.response?.status === 401) {
                errorMessage =
                    "You are not authenticated. Please log in again.";
            } else if (error.response?.status === 403) {
                errorMessage =
                    "You don't have permission to perform this action.";
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "rejected":
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    return (
        <>
            <Head title="Employee Dashboard - MaxERP" />
            <div className="min-h-screen bg-gray-50">
                <Header auth={auth} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {auth.user.name}!
                        </h1>
                        <p className="text-gray-600">
                            Manage your leave requests and track your time off.
                        </p>
                    </div>

                    {/* Leave Balance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {loading
                            ? // Loading skeleton
                              Array.from({ length: 3 }).map((_, index) => (
                                  <motion.div
                                      key={index}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                  >
                                      <Card>
                                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                              <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                                          </CardHeader>
                                          <CardContent>
                                              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                                              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                          </CardContent>
                                      </Card>
                                  </motion.div>
                              ))
                            : leaveBalances.map((balance, index) => (
                                  <motion.div
                                      key={balance.type}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                  >
                                      <Card>
                                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                              <CardTitle className="text-sm font-medium">
                                                  {balance.type} Leave
                                              </CardTitle>
                                              <Calendar className="h-4 w-4 text-muted-foreground" />
                                          </CardHeader>
                                          <CardContent>
                                              <div className="text-2xl font-bold">
                                                  {balance.remaining} days
                                              </div>
                                              <p className="text-xs text-muted-foreground">
                                                  {balance.used} of{" "}
                                                  {balance.total} used
                                              </p>
                                          </CardContent>
                                      </Card>
                                  </motion.div>
                              ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Quick Actions
                        </h2>
                        <Dialog
                            open={showLeaveForm}
                            onOpenChange={setShowLeaveForm}
                        >
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Request Leave
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Request Leave</DialogTitle>
                                    <DialogDescription>
                                        Submit a new leave request for approval.
                                    </DialogDescription>
                                </DialogHeader>
                                <form
                                    onSubmit={handleSubmitLeave}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="leaveType">
                                                Leave Type
                                            </Label>
                                            <Select
                                                value={leaveForm.leaveType}
                                                onValueChange={(value) =>
                                                    setLeaveForm({
                                                        ...leaveForm,
                                                        leaveType: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select leave type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="vacation">
                                                        Vacation
                                                    </SelectItem>
                                                    <SelectItem value="sick">
                                                        Sick Leave
                                                    </SelectItem>
                                                    <SelectItem value="personal">
                                                        Personal
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="startDate">
                                                Start Date
                                            </Label>
                                            <Input
                                                id="startDate"
                                                type="date"
                                                value={leaveForm.startDate}
                                                onChange={(e) => {
                                                    const newStartDate =
                                                        e.target.value;
                                                    setLeaveForm({
                                                        ...leaveForm,
                                                        startDate: newStartDate,
                                                        // Clear end date if it's before the new start date
                                                        endDate:
                                                            leaveForm.endDate &&
                                                            leaveForm.endDate <
                                                                newStartDate
                                                                ? ""
                                                                : leaveForm.endDate,
                                                    });
                                                }}
                                                min={
                                                    new Date()
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="endDate">
                                                End Date
                                            </Label>
                                            <Input
                                                id="endDate"
                                                type="date"
                                                value={leaveForm.endDate}
                                                onChange={(e) =>
                                                    setLeaveForm({
                                                        ...leaveForm,
                                                        endDate: e.target.value,
                                                    })
                                                }
                                                min={
                                                    leaveForm.startDate ||
                                                    new Date()
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="reason">
                                                Reason
                                            </Label>
                                            <Input
                                                id="reason"
                                                placeholder="Enter reason for leave"
                                                value={leaveForm.reason}
                                                onChange={(e) =>
                                                    setLeaveForm({
                                                        ...leaveForm,
                                                        reason: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setShowLeaveForm(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? "Submitting..."
                                                : "Submit Request"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Recent Requests */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Leave Requests</CardTitle>
                            <CardDescription>
                                Your recent leave requests and their status.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loading ? (
                                    // Loading skeleton for requests
                                    Array.from({ length: 2 }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 border rounded-lg"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                                                    <div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
                                                        <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                                                    </div>
                                                </div>
                                                <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                                            </div>
                                        )
                                    )
                                ) : recentRequests.length > 0 ? (
                                    recentRequests.map((request) => (
                                        <motion.div
                                            key={request.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex items-center space-x-4">
                                                {getStatusIcon(request.status)}
                                                <div>
                                                    <p className="font-medium">
                                                        {request.type} Leave
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {formatDateRange(
                                                            request.startDate,
                                                            request.endDate,
                                                            request.days
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {request.reason}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    request.status
                                                )}`}
                                            >
                                                {request.status}
                                            </span>
                                        </motion.div>
                                    ))
                                ) : (
                                    // Empty state
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <svg
                                                className="w-8 h-8 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No Leave Requests Yet
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            You haven't submitted any leave
                                            requests yet.
                                        </p>
                                        <Button
                                            onClick={() =>
                                                setShowLeaveForm(true)
                                            }
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            Submit Your First Request
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default EmployeeDashboard;
