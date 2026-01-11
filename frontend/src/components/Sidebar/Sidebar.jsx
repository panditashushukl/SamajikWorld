import React from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { LoginDialog } from "../Dialogs/LoginAlertDialog/LoginAlertDialog";
import { useState } from "react";
import { NAVIGATION_ITEMS, BOTTOM_NAVIGATION_ITEMS } from "../../utils/constants";
import { closeMobileSidebar } from "../../slice/uiSlice";
import { X } from "lucide-react";

function Sidebar({ className }) {
    const navigator = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);

    // Redux state
    const isLoggedIn = useSelector((state) => state.loginUser.login_user.user);
    const { sidebarOpen, mobileSidebarOpen } = useSelector((state) => state.ui);

    const handleNavigation = (item) => {
        if (item.requiresAuth && !isLoggedIn) {
            setLoginDialogOpen(true);
            return;
        }
        navigator(item.route);
        // Close mobile sidebar on navigation
        if (mobileSidebarOpen) {
            dispatch(closeMobileSidebar());
        }
    };

    const NavItem = ({ item }) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.route;

        return (
            <li className="w-full">
                <button
                    onClick={() => handleNavigation(item)}
                    className={`
                        flex items-center w-full
                        ${sidebarOpen
                            ? "flex-row px-4 py-3 justify-start gap-4"
                            : "flex-col px-2 py-3 justify-center gap-1"
                        }
                        transition-all duration-200 rounded-lg
                        ${isActive
                            ? "bg-[#ae7aff] text-black font-semibold"
                            : "text-white hover:bg-neutral-800"
                        }
                    `}
                    title={!sidebarOpen ? item.label : ""}
                >
                    <span className="shrink-0">
                        <Icon size={sidebarOpen ? 22 : 24} />
                    </span>
                    <span
                        className={`
                            whitespace-nowrap transition-all duration-200
                            ${sidebarOpen
                                ? "opacity-100 translate-x-0"
                                : "hidden sm:hidden" // Completely hide text in collapsed mode on desktop
                            }
                        `}
                    >
                        {item.label}
                    </span>
                    {/* Tooltip-like text for mobile collapsed state or desktop hover usually handled by title */}
                </button>
            </li>
        );
    };

    return (
        <>
            <LoginDialog
                open={loginDialogOpen}
                onClose={() => setLoginDialogOpen(false)}
            />

            {/* Desktop Sidebar */}
            <aside
                className={`
                    hidden sm:flex flex-col bg-[#121212] border-r border-[#2d2d2d]
                    h-[calc(100vh-64px)] sticky top-[64px] left-0 overflow-y-auto overflow-x-hidden
                    transition-all duration-300 ease-in-out z-40
                    ${sidebarOpen ? "w-[240px]" : "w-[72px]"}
                    ${className}
                `}
            >
                <div className="flex-1 py-4 px-2">
                    <ul className="space-y-1">
                        {NAVIGATION_ITEMS.map((item) => (
                            <NavItem key={item.id} item={item} />
                        ))}
                    </ul>

                    <div className="my-4 border-t border-[#2d2d2d] mx-2"></div>

                    <ul className="space-y-1">
                        {BOTTOM_NAVIGATION_ITEMS.map((item) => (
                            <NavItem key={item.id} item={item} />
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 sm:hidden"
                    onClick={() => dispatch(closeMobileSidebar())}
                >
                    <aside
                        className="w-[280px] h-full bg-[#121212] flex flex-col p-4 animate-in slide-in-from-left duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6 px-2">
                            <h2 className="text-xl font-bold text-white">Menu</h2>
                            <button
                                onClick={() => dispatch(closeMobileSidebar())}
                                className="p-2 hover:bg-neutral-800 rounded-full text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <ul className="space-y-2">
                            {NAVIGATION_ITEMS.filter(item => item.showOnMobile).map((item) => (
                                <li key={item.id} className="w-full">
                                    <button
                                        onClick={() => handleNavigation(item)}
                                        className={`
                                            flex items-center w-full px-4 py-3 gap-4 rounded-lg
                                            ${location.pathname === item.route
                                                ? "bg-[#ae7aff] text-black font-semibold"
                                                : "text-white hover:bg-neutral-800"
                                            }
                                        `}
                                    >
                                        <item.icon size={22} />
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="my-4 border-t border-[#2d2d2d]"></div>

                        <ul className="space-y-2">
                            {BOTTOM_NAVIGATION_ITEMS.map((item) => (
                                <li key={item.id} className="w-full">
                                    <button
                                        onClick={() => handleNavigation(item)}
                                        className={`
                                            flex items-center w-full px-4 py-3 gap-4 rounded-lg
                                            ${location.pathname === item.route
                                                ? "bg-[#ae7aff] text-black font-semibold"
                                                : "text-white hover:bg-neutral-800"
                                            }
                                        `}
                                    >
                                        <item.icon size={22} />
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            )}
        </>
    );
}

export default Sidebar;
