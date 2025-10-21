import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
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

    // Mock data for leave balances
    const leaveBalances = [
        { type: "Vacation", total: 20, used: 5, remaining: 15 },
        { type: "Sick", total: 10, used: 2, remaining: 8 },
        { type: "Personal", total: 5, used: 1, remaining: 4 },
    ];

    // Mock data for recent requests
    const recentRequests = [
        {
            id: 1,
            type: "Vacation",
            startDate: "2024-02-15",
            endDate: "2024-02-20",
            days: 5,
            status: "approved",
            reason: "Family vacation",
        },
        {
            id: 2,
            type: "Sick",
            startDate: "2024-01-10",
            endDate: "2024-01-10",
            days: 1,
            status: "pending",
            reason: "Doctor appointment",
        },
    ];

    const handleSubmitLeave = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle leave request submission
        console.log("Submitting leave request:", leaveForm);
        setShowLeaveForm(false);
        setLeaveForm({ leaveType: "", startDate: "", endDate: "", reason: "" });
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
                        {leaveBalances.map((balance, index) => (
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
                                            {balance.used} of {balance.total}{" "}
                                            used
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
                                                onChange={(e) =>
                                                    setLeaveForm({
                                                        ...leaveForm,
                                                        startDate:
                                                            e.target.value,
                                                    })
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
                                        >
                                            Submit Request
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
                                {recentRequests.map((request) => (
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
                                                    {request.startDate} -{" "}
                                                    {request.endDate} (
                                                    {request.days} days)
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
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default EmployeeDashboard;
