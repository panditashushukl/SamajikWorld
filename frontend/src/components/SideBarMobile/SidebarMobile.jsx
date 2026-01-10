import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

import {
    Users,
    FolderOpen,
    Clock,
    History,
    ThumbsUp,
    Home
} from "lucide-react";
import { LoginDialog } from "../Dialogs/LoginAlertDialog/LoginAlertDialog";


const navigationItems = [
    {
        id: "home",
        label: "Home",
        icon: Home,
        route: "/",
        requiresAuth: false,
        showOnMobile: true
    },
    {
        id: "liked",
        label: "Liked Videos",
        icon: ThumbsUp,
        route: "/liked-videos",
        requiresAuth: true,
        showOnMobile: false
    },
    {
        id: "history",
        label: "History",
        icon: History,
        route: "/watch-history",
        requiresAuth: true,
        showOnMobile: true
    },
    {
        id: "watchLater",
        label: "Watch Later",
        icon: Clock,
        route: "/watch-later",
        requiresAuth: true,
        showOnMobile: false
    },
    {
        id: "playlists",
        label: "My Playlists",
        icon: FolderOpen,
        route: "/my-playlists",
        requiresAuth: true,
        showOnMobile: true
    },
    {
        id: "subscribers",
        label: "Subscribers",
        icon: Users,
        route: "/subscribers",
        requiresAuth: true,
        showOnMobile: true
    }
];



function SidebarMobile() {
    const navigate = useNavigate();
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const isLoggedIn = useSelector((state) => state.loginUser.login_user.user);

    const handleNavigation = (item) => {
        if (!isLoggedIn) {
            setLoginDialogOpen(true);
            return;
        }
        navigate(item.route);
    };

   

    return (
        <>
            <LoginDialog
                open={loginDialogOpen}
                onClose={() => setLoginDialogOpen(false)}
            />

            {/* Mobile Navigation */}
            <div className="sm:hidden">
                {/* Mobile Bottom Navigation Bar */}
                <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212] border-t border-neutral-800 px-4 py-2">
                    <div className="flex justify-around items-center">
                        {navigationItems
                            .filter((item) => item.showOnMobile)
                            .slice(0, 4)
                            .map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavigation(item)}
                                        className="flex flex-col items-center justify-center p-2 text-neutral-400 hover:text-white transition-colors duration-200"
                                        aria-label={item.label}
                                    >
                                        <IconComponent className="w-5 h-5 mb-1" />
                                        <span className="text-xs font-medium">
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                       
                    </div>
                </nav>

                {/* Spacer for bottom navigation */}
                <div className="h-16" />
            </div>
        </>
    );
}

export default SidebarMobile;
