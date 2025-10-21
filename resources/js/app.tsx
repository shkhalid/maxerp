import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import "./bootstrap";

const appName = import.meta.env.VITE_APP_NAME || "MaxERP";

createInertiaApp({
    title: (title) =>
        title
            ? `${title} - ${appName}`
            : "MaxERP - Track, Trust & Win! | Money Committee Tracking Platform",
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
