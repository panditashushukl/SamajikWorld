import {
    Home,
    ThumbsUp,
    History,
    Clock,
    FolderOpen,
    Users,
    HelpCircle,
    Settings
} from "lucide-react";

export const NAVIGATION_ITEMS = [
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

export const BOTTOM_NAVIGATION_ITEMS = [
    {
        id: "support",
        label: "Support",
        icon: HelpCircle,
        route: "/support",
        requiresAuth: false
    },
    {
        id: "settings",
        label: "Settings",
        icon: Settings,
        route: "/settings",
        requiresAuth: false
    }
];
