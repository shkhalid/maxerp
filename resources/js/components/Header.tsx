import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, Copy, CheckCircle } from "lucide-react";

interface HeaderProps {
    auth: {
        user: any;
    };
    showCopyButton?: boolean;
    className?: string;
}

function Header({
    auth,
    showCopyButton = false,
    className = "",
}: HeaderProps): JSX.Element {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        // Show success toast
        toast({
            title: "Link Copied",
            description: "Page link has been copied to clipboard.",
            variant: "default",
        });
    };

    const handleLogout = () => {
        // Handle logout using Inertia router
        router.post("/logout");
    };

    return (
        <header
            className={`bg-white/80 backdrop-blur-sm shadow-sm border-b ${className}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-2xl font-bold text-blue-600">
                        MaxERP
                    </Link>
                    <div className="flex items-center space-x-4">
                        {showCopyButton && (
                            <Button
                                onClick={handleCopyLink}
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Link
                                    </>
                                )}
                            </Button>
                        )}
                        {auth.user ? (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/dashboard"
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {auth.user.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {auth.user.name}
                                    </span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Link href="/profile">Profile</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button variant="outline" size="sm">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
