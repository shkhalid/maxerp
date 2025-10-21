import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { formatDateRange, formatDate } from "@/lib/dateUtils";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
    LoadingSkeleton,
    CardSkeleton,
} from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
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
import Header from "@/components/Header";
import { MonthlySummary } from "@/components/MonthlySummary";
import {
    CheckCircle,
    XCircle,
    Clock,
    Users,
    Calendar,
    AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface ManagerDashboardProps {
    auth: {
        user: any;
    };
}

function ManagerDashboard({ auth }: ManagerDashboardProps): JSX.Element {
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [showApprovalDialog, setShowApprovalDialog] = useState(false);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [onLeaveToday, setOnLeaveToday] = useState(0);
    const [showMonthlySummary, setShowMonthlySummary] = useState(false);
    const { toast } = useToast();

    // Fetch pending requests and on leave today count
    useEffect(() => {
        fetchPendingRequests();
        fetchOnLeaveToday();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/v1/leave/pending");
            if (response.data.success) {
                // Format the data to match the expected structure
                const formattedRequests = response.data.data.map(
                    (request: any) => ({
                        id: request.id,
                        employee: {
                            name: request.user.name,
                            email: request.user.email,
                            department: "Engineering", // You might want to add department to user model
                        },
                        leaveType:
                            request.leave_type.charAt(0).toUpperCase() +
                            request.leave_type.slice(1),
                        startDate: request.start_date,
                        endDate: request.end_date,
                        days: request.days_requested,
                        reason: request.reason,
                        submittedAt: request.created_at,
                        leaveBalance: {
                            vacation: 15, // You might want to fetch this from API
                            sick: 8,
                            personal: 4,
                        },
                    })
                );
                setPendingRequests(formattedRequests);
            }
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            // Fallback to mock data
            setPendingRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchOnLeaveToday = async () => {
        try {
            const today = new Date().toISOString().split("T")[0];
            const response = await axios.get(
                `/api/v1/leave/on-leave-today?date=${today}`
            );
            if (response.data.success) {
                setOnLeaveToday(response.data.count);
            }
        } catch (error) {
            console.error("Error fetching on leave today count:", error);
            // Fallback to 0 if API fails
            setOnLeaveToday(0);
        }
    };

    const handleApprove = async (requestId: number) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `/api/v1/leave/approve/${requestId}`,
                {
                    action: "approve",
                }
            );

            if (response.data.success) {
                toast({
                    title: "Success",
                    description: "Leave request approved successfully!",
                });
                setShowApprovalDialog(false);
                setSelectedRequest(null);
                fetchPendingRequests(); // Refresh the list
            } else {
                toast({
                    title: "Error",
                    description: response.data.message,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.error("Error approving request:", error);
            const errorMessage =
                error.response?.data?.message || "An error occurred";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (requestId: number) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `/api/v1/leave/approve/${requestId}`,
                {
                    action: "reject",
                }
            );

            if (response.data.success) {
                toast({
                    title: "Success",
                    description: "Leave request rejected successfully!",
                });
                setShowApprovalDialog(false);
                setSelectedRequest(null);
                fetchPendingRequests(); // Refresh the list
            } else {
                toast({
                    title: "Error",
                    description: response.data.message,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.error("Error rejecting request:", error);
            const errorMessage =
                error.response?.data?.message || "An error occurred";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const openApprovalDialog = (request: any) => {
        setSelectedRequest(request);
        setShowApprovalDialog(true);
    };

    return (
        <>
            <Head title="Manager Dashboard - MaxERP" />
            <div className="min-h-screen bg-gray-50">
                <Header auth={auth} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Manager Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Review and approve leave requests from your team.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="h-32">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Pending Requests
                                    </CardTitle>
                                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {pendingRequests.length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Awaiting approval
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="h-32">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Team Members
                                    </CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">24</div>
                                    <p className="text-xs text-muted-foreground">
                                        Active employees
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card
                                className="h-32 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                                onClick={() => setShowMonthlySummary(true)}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        This Month
                                    </CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">12</div>
                                    <p className="text-xs text-muted-foreground">
                                        Approved requests
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        Click to view summary →
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="h-32">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        On Leave Today
                                    </CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {onLeaveToday}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Team members
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Pending Requests */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Leave Requests</CardTitle>
                            <CardDescription>
                                Review and approve leave requests from your team
                                members.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loading ? (
                                    // Loading skeleton
                                    Array.from({ length: 2 }).map(
                                        (_, index) => (
                                            <CardSkeleton key={index} />
                                        )
                                    )
                                ) : pendingRequests.length > 0 ? (
                                    pendingRequests.map((request, index) => (
                                        <motion.div
                                            key={request.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border rounded-lg p-6"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-4 mb-4">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="text-blue-600 font-semibold">
                                                                {request.employee.name.charAt(
                                                                    0
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">
                                                                {
                                                                    request
                                                                        .employee
                                                                        .name
                                                                }
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {
                                                                    request
                                                                        .employee
                                                                        .email
                                                                }{" "}
                                                                •{" "}
                                                                {
                                                                    request
                                                                        .employee
                                                                        .department
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">
                                                                Leave Type
                                                            </p>
                                                            <p className="text-sm text-gray-900">
                                                                {
                                                                    request.leaveType
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">
                                                                Duration
                                                            </p>
                                                            <p className="text-sm text-gray-900">
                                                                {formatDateRange(
                                                                    request.startDate,
                                                                    request.endDate,
                                                                    request.days
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">
                                                                Reason
                                                            </p>
                                                            <p className="text-sm text-gray-900">
                                                                {request.reason}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">
                                                                Submitted
                                                            </p>
                                                            <p className="text-sm text-gray-900">
                                                                {formatDate(
                                                                    request.submittedAt
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                                            Employee Leave
                                                            Balance
                                                        </p>
                                                        <div className="flex space-x-4 text-sm">
                                                            <span>
                                                                Vacation:{" "}
                                                                {
                                                                    request
                                                                        .leaveBalance
                                                                        .vacation
                                                                }{" "}
                                                                days
                                                            </span>
                                                            <span>
                                                                Sick:{" "}
                                                                {
                                                                    request
                                                                        .leaveBalance
                                                                        .sick
                                                                }{" "}
                                                                days
                                                            </span>
                                                            <span>
                                                                Personal:{" "}
                                                                {
                                                                    request
                                                                        .leaveBalance
                                                                        .personal
                                                                }{" "}
                                                                days
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-2 ml-4">
                                                    <Button
                                                        onClick={() =>
                                                            openApprovalDialog(
                                                                request
                                                            )
                                                        }
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        onClick={() =>
                                                            openApprovalDialog(
                                                                request
                                                            )
                                                        }
                                                        variant="destructive"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <EmptyState
                                        icon={
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
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        }
                                        title="No Pending Requests"
                                        description="All caught up! There are no pending leave requests to review."
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Approval Dialog */}
                    <Dialog
                        open={showApprovalDialog}
                        onOpenChange={setShowApprovalDialog}
                    >
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {selectedRequest
                                        ? `Review ${selectedRequest.employee.name}'s Request`
                                        : "Review Request"}
                                </DialogTitle>
                                <DialogDescription>
                                    Please review the leave request details
                                    before making a decision.
                                </DialogDescription>
                            </DialogHeader>
                            {selectedRequest && (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium mb-2">
                                            Request Details
                                        </h4>
                                        <p>
                                            <strong>Employee:</strong>{" "}
                                            {selectedRequest.employee.name}
                                        </p>
                                        <p>
                                            <strong>Type:</strong>{" "}
                                            {selectedRequest.leaveType}
                                        </p>
                                        <p>
                                            <strong>Dates:</strong>{" "}
                                            {formatDateRange(
                                                selectedRequest.startDate,
                                                selectedRequest.endDate,
                                                selectedRequest.days
                                            )}
                                        </p>
                                        <p>
                                            <strong>Reason:</strong>{" "}
                                            {selectedRequest.reason}
                                        </p>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            onClick={() =>
                                                handleReject(selectedRequest.id)
                                            }
                                            variant="destructive"
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleApprove(
                                                    selectedRequest.id
                                                )
                                            }
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Approve
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Monthly Summary Dialog */}
                    <Dialog
                        open={showMonthlySummary}
                        onOpenChange={setShowMonthlySummary}
                    >
                        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">
                                    Monthly Leave Summary
                                </DialogTitle>
                                <DialogDescription>
                                    Comprehensive analytics and insights for
                                    your team's leave patterns
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4">
                                <MonthlySummary />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    );
}

export default ManagerDashboard;
