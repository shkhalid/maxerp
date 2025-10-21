import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { router } from "@inertiajs/react";

interface LandingProps {
    auth: {
        user: any;
    };
}

function Landing({ auth }: LandingProps): JSX.Element {
    return (
        <div className="min-h-screen overflow-hidden">
            <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
                </div>

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left space-y-8"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block"
                            >
                                <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                                    ✨ Modern HR Management
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                            >
                                <span className="text-gradient">MaxERP</span>
                                <br />
                                <span className="text-gray-800">
                                    Leave Management System
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0"
                            >
                                Streamline your HR processes with our modern
                                leave management system. Employees can submit
                                requests, managers can approve them, and
                                everyone stays informed with real-time updates
                                and notifications.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <Button
                                    onClick={() =>
                                        router.visit(
                                            auth.user ? "/dashboard" : "/login",
                                            {
                                                preserveScroll: true,
                                            }
                                        )
                                    }
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                >
                                    {auth.user
                                        ? "Go to Dashboard"
                                        : "Get Started"}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-600"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>Trusted by 500+ companies</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span>100% Secure</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative"
                        >
                            <div className="relative z-10">
                                <img
                                    className="w-full h-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                                    alt="Modern HR team collaborating and managing leave requests digitally"
                                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
                                />
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border-2 border-yellow-400"
                            >
                                <div className="text-3xl">📅</div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border-2 border-teal-400"
                            >
                                <div className="text-3xl">✅</div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Landing;
