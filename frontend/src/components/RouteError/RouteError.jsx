// src/components/Error/RouteError.jsx
import React from "react";
import { useRouteError } from "react-router";

export default function RouteError() {
    const error = useRouteError();
    console.error("Route Error:", error);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-[#121212] text-white">
            <h1 className="text-4xl font-bold mb-4">
                Oops! Something went wrong 😢
            </h1>
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 max-w-2xl w-full">
                <p className="text-xl font-semibold text-red-400 mb-2">
                    {error?.statusText || "Error Occurred"}
                </p>
                <p className="text-gray-300 font-mono text-sm break-words mb-4">
                    {error?.message ||
                        (typeof error === 'string' ? error : "Unknown error")}
                </p>
                {error?.stack && (
                    <details className="text-left mt-4 bg-black/50 p-4 rounded text-xs font-mono overflow-auto max-h-64">
                        <summary className="cursor-pointer text-gray-400 hover:text-white mb-2">
                            Stack Trace
                        </summary>
                        <pre className="whitespace-pre-wrap text-red-300">
                            {error.stack}
                        </pre>
                    </details>
                )}
            </div>
            <p className="mt-8 text-gray-500">
                Check the console for more details.
            </p>
        </div>
    );
}
