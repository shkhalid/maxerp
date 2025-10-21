import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
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
import Header from "@/components/Header";
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
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch pending requests
    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get("/api/v1/leave/pending");
            if (response.data.success) {
                setPendingRequests(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            // Fallback to mock data
            setPendingRequests([
                {
                    id: 1,
                    employee: {
                        name: "John Doe",
                        email: "john@company.com",
                        department: "Engineering",
                    },
                    leaveType: "Vacation",
                    startDate: "2024-02-15",
                    endDate: "2024-02-20",
                    days: 5,
                    reason: "Family vacation",
                    submittedAt: "2024-01-15",
                    leaveBalance: {
                        vacation: 15,
                        sick: 8,
                        personal: 4,
                    },
                },
                {
                    id: 2,
                    employee: {
                        name: "Jane Smith",
                        email: "jane@company.com",
                        department: "Marketing",
                    },
                    leaveType: "Sick",
                    startDate: "2024-01-25",
                    endDate: "2024-01-25",
                    days: 1,
                    reason: "Doctor appointment",
                    submittedAt: "2024-01-20",
                    leaveBalance: {
                        vacation: 12,
                        sick: 7,
                        personal: 3,
                    },
                },
            ]);
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
                alert("Leave request approved successfully!");
                setShowApprovalDialog(false);
                setSelectedRequest(null);
                fetchPendingRequests(); // Refresh the list
            } else {
                alert("Error: " + response.data.message);
            }
        } catch (error: any) {
            console.error("Error approving request:", error);
            const errorMessage =
                error.response?.data?.message || "An error occurred";
            alert("Error: " + errorMessage);
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
                alert("Leave request rejected successfully!");
                setShowApprovalDialog(false);
                setSelectedRequest(null);
                fetchPendingRequests(); // Refresh the list
            } else {
                alert("Error: " + response.data.message);
            }
        } catch (error: any) {
            console.error("Error rejecting request:", error);
            const errorMessage =
                error.response?.data?.message || "An error occurred";
            alert("Error: " + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const openApprovalDialog = (request: any) => {
        setSelectedRequest(request);
        setShowApprovalDialog(true);
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
                            <Card>
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
                            <Card>
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
                            <Card>
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
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        On Leave Today
                                    </CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">3</div>
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
                                {pendingRequests.map((request, index) => (
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
                                                                request.employee
                                                                    .name
                                                            }
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {
                                                                request.employee
                                                                    .email
                                                            }{" "}
                                                            •{" "}
                                                            {
                                                                request.employee
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
                                                            {request.leaveType}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            Duration
                                                        </p>
                                                        <p className="text-sm text-gray-900">
                                                            {request.startDate}{" "}
                                                            - {request.endDate}{" "}
                                                            ({request.days}{" "}
                                                            days)
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
                                                            {
                                                                request.submittedAt
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                                        Employee Leave Balance
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
                                ))}
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
                                            {selectedRequest.startDate} -{" "}
                                            {selectedRequest.endDate}
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
                </div>
            </div>
        </>
    );
}

export default ManagerDashboard;
