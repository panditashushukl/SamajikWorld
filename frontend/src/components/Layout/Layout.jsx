import React from "react";
import { Header, Sidebar } from "../index";
import { Outlet } from "react-router";

function Layout() {
    return (
        <div className="h-screen overflow-y-scroll scrollbar-hide bg-[#121212] text-white">
            <Header />
            <div className="flex min-h-[calc(100vh-82px)]">
                <Sidebar />
                <div className="w-full scrollbar-hide">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;
