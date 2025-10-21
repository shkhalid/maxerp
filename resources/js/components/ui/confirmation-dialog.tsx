import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    onConfirm: () => void;
    loading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    onConfirm,
    loading = false,
}) => {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center space-x-3">
                        {variant === "destructive" && (
                            <div className="flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                        )}
                        <div>
                            <DialogTitle className="text-lg font-semibold">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="mt-2">
                                {description}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="w-full sm:w-auto"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={
                            variant === "destructive"
                                ? "destructive"
                                : "default"
                        }
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`w-full sm:w-auto font-medium transition-all duration-200 ${
                            variant === "destructive"
                                ? "bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-sm hover:shadow-md focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                : ""
                        }`}
                    >
                        {loading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationDialog;
