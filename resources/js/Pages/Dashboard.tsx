import React, { useState } from "react";
import { Head, Link, usePage, useForm, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Header from "@/components/Header";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import {
    Plus,
    Users,
    Calendar,
    DollarSign,
    MoreVertical,
    Edit,
    Trash2,
    Share2,
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardProps {
    auth: {
        user: any;
    };
}

function Dashboard({ auth }: DashboardProps): JSX.Element {
    return (
        <>
            <Head title="Dashboard - MaxERP" />
            <div className="min-h-screen bg-gray-50">
                <Header auth={auth} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, {auth.user?.name}!
                        </h1>
                        <p className="text-gray-600">
                            Manage your Kametis and track your savings journey.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Kametis
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{0}</div>
                                <p className="text-xs text-muted-foreground">
                                    Active committees
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Members
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">
                                    Across all Kametis
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Amount
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₨ 0</div>
                                <p className="text-xs text-muted-foreground">
                                    Total pool amount
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Kametis
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">
                                    Currently running
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Your Kametis
                        </h2>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Kameti
                        </Button>
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    );
}

export default Dashboard;
