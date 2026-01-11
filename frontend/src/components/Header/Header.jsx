import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { getImageUrl } from "../../Helper/getImageUrl";
import { Button } from "../ui/button";
import { LoginDialog } from "../Dialogs/LoginAlertDialog/LoginAlertDialog";
import { Menu, LogIn } from "lucide-react";
import { toggleSidebar, toggleMobileSidebar } from "../../slice/uiSlice";
import { useLogout } from "../../hooks/useLogout.hook";

function Header() {
    const isLoggedIn = useSelector((state) => state.loginUser.login_user.user);
    const logout = useLogout();
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleMenuClick = () => {
        // Toggle desktop sidebar or mobile sidebar based on screen width
        if (window.innerWidth >= 640) { // sm breakpoint
            dispatch(toggleSidebar());
        } else {
            dispatch(toggleMobileSidebar());
        }
    };

    return (
        <>
            <LoginDialog
                open={loginDialogOpen}
                onClose={() => setLoginDialogOpen(false)}
            />
            <header className="sticky items-center inset-x-0 top-0 z-50 w-full border-b border-[#2d2d2d] bg-[#121212] px-4">
                <nav className="flex items-center h-16 w-full max-w-[1800px] mx-auto">
                    {/* Left: Menu & Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleMenuClick}
                            className="p-2 text-white hover:bg-neutral-800 rounded-full transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <Link to="/" className="flex items-center gap-1">
                            <img
                                src="/images/5W.svg"
                                alt="logo"
                                className="h-8 w-auto"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <span className="text-white font-bold text-xl hidden sm:block">SamajikWorld</span>
                        </Link>
                    </div>

                    {/* Right: User Actions */}
                    <div className="ml-auto flex items-center gap-4">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to={`/channel/${isLoggedIn?.username}/videos`}
                                    className="relative flex-shrink-0"
                                >
                                    <img
                                        src={getImageUrl(isLoggedIn?.avatar, "/user.png")}
                                        alt="User Avatar"
                                        className="h-10 w-10 rounded-full object-cover border border-neutral-700"
                                        onError={(e) => {
                                            e.target.src = "/user.png";
                                        }}
                                    />
                                </Link>
                                <Button
                                    onClick={logout}
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 hidden sm:flex"
                                >
                                    Log out
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="sm:hidden text-white p-2">
                                    <LogIn size={24} />
                                </Link>
                                <div className="hidden sm:flex gap-2">
                                    <Button
                                        onClick={() => navigate("/login")}
                                        className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                                    >
                                        Log in
                                    </Button>
                                    <Button
                                        onClick={() => navigate("/register")}
                                        className="bg-[#ae7aff] hover:bg-[#965eff] text-black font-semibold"
                                    >
                                        Sign up
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>
        </>
    );
}

export default Header;
