import React, { useState, useEffect } from "react";
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Volume2,
    Wifi,
    ChevronRight,
    Save,
    Eye,
    EyeOff,
    Edit,
    X
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSettings, setLoading, setError } from "../../slice/settingsSlice";
import { userService } from "../../service/user.service";

const SettingsComponent = () => {
    const dispatch = useDispatch();
    const [activeSection, setActiveSection] = useState("profile");
    const [isEditMode, setIsEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        displayName: "",
        username: "",
        bio: "",
        email: "",
        password: "password123"
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoadingState] = useState(true);

    // Redux state
    const { notifications, privacy } = useSelector((state) => state.settings);
    const user = useSelector((state) => state.loginUser?.login_user?.user);

    const sections = [
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "privacy", label: "Privacy & Security", icon: Shield },
        { id: "appearance", label: "Appearance", icon: Palette },
        { id: "language", label: "Language & Region", icon: Globe },
        { id: "audio", label: "Audio & Video", icon: Volume2 },
        { id: "network", label: "Network", icon: Wifi }
    ];

    // Fetch settings on component mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoadingState(true);
                const response = await userService.getSettings();
                if (response?.payload) {
                    dispatch(setSettings(response.payload));
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
                dispatch(setError(error.message));
            } finally {
                setIsLoadingState(false);
            }
        };

        fetchSettings();
    }, [dispatch]);

    // Initialize profile data from user
    useEffect(() => {
        if (user) {
            setProfileData({
                displayName: user.fullName || "",
                username: user.username || "",
                bio: user.bio || "",
                email: user.email || "",
                password: "password123"
            });
            // Set avatar preview from user data
            if (user.avatar) {
                setAvatarPreview(user.avatar);
            }
        }
    }, [user]);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            
            // Upload avatar if changed
            if (avatarFile) {
                const formData = new FormData();
                formData.append("avatar", avatarFile);
                await userService.updateUserAvatar(formData);
                setAvatarFile(null);
            }

            // Update profile details
            const profileUpdateData = {
                fullName: profileData.displayName,
                email: profileData.email
            };
            await userService.updateAccountDetails(profileUpdateData);
            
            setIsEditMode(false);
        } catch (error) {
            console.error("Failed to save profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleNotification = (key) => {
        const updated = {
            ...notifications,
            [key]: !notifications[key]
        };
        dispatch(setSettings({ notifications: updated }));
    };

    const handleTogglePrivacy = (key) => {
        const updated = {
            ...privacy,
            [key]: !privacy[key]
        };
        dispatch(setSettings({ privacy: updated }));
    };

    const handlePrivacySelectChange = (value) => {
        const updated = {
            ...privacy,
            profileVisibility: value
        };
        dispatch(setSettings({ privacy: updated }));
    };

    const handleProfileDataChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const saveSettings = async () => {
        try {
            setIsSaving(true);
            const settingsData = {
                notifications,
                privacy
            };
            await userService.updateSettings(settingsData);
        } catch (error) {
            console.error("Failed to save settings:", error);
            dispatch(setError(error.message));
        } finally {
            setIsSaving(false);
        }
    };

    // === Profile Section ===
    const renderProfileSection = () => (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Avatar Section */}
                <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
                        {avatarPreview ? (
                            <img 
                                src={avatarPreview} 
                                alt="User Avatar" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            user?.fullName?.split(" ").map(n => n[0]).join("") || "U"
                        )}
                    </div>
                    {isEditMode && (
                        <>
                            <input
                                type="file"
                                id="avatar-upload"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <button
                                onClick={() => document.getElementById("avatar-upload").click()}
                                className="absolute -bottom-2 -right-2 bg-indigo-600 border-2 border-background p-2 rounded-full hover:bg-indigo-700 transition-colors text-white"
                            >
                                <Edit size={14} />
                            </button>
                        </>
                    )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-4">
                    {!isEditMode ? (
                        // View Mode
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Display Name</p>
                                <p className="text-lg font-semibold text-foreground">{profileData.displayName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Username</p>
                                <p className="text-lg font-semibold text-foreground">@{profileData.username}</p>
                            </div>
                            {profileData.bio && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Bio</p>
                                    <p className="text-foreground">{profileData.bio}</p>
                                </div>
                            )}
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Edit size={16} />
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        // Edit Mode
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Display Name"
                                    value={profileData.displayName}
                                    onChange={(e) => handleProfileDataChange("displayName", e.target.value)}
                                />
                                <Input
                                    label="Username"
                                    value={profileData.username}
                                    onChange={(e) => handleProfileDataChange("username", e.target.value)}
                                />
                            </div>
                            <Textarea
                                label="Bio"
                                value={profileData.bio}
                                onChange={(e) => handleProfileDataChange("bio", e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-border pt-6">
                <h4 className="text-lg font-semibold text-foreground mb-4">
                    Account Security
                </h4>
                {!isEditMode ? (
                    // View Mode
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Email Address</p>
                            <p className="text-foreground">{profileData.email}</p>
                        </div>
                    </div>
                ) : (
                    // Edit Mode
                    <div className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleProfileDataChange("email", e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    );

    // === Notifications Section ===
    const renderNotificationsSection = () => (
        <SectionWrapper title="Notification Preferences">
            {Object.entries(notifications).map(([key, value]) => (
                <ToggleRow
                    key={key}
                    label={key.replace(/([A-Z])/g, " $1").trim()}
                    value={value}
                    onToggle={() => handleToggleNotification(key)}
                />
            ))}
        </SectionWrapper>
    );

    // === Privacy Section ===
    const renderPrivacySection = () => (
        <SectionWrapper title="Privacy Settings">
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Profile Visibility
                </label>
                <select
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacySelectChange(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                </select>
            </div>
            {Object.entries(privacy)
                .filter(([key]) => key !== "profileVisibility")
                .map(([key, value]) => (
                    <ToggleRow
                        key={key}
                        label={key.replace(/([A-Z])/g, " $1").trim()}
                        value={value}
                        onToggle={() => handleTogglePrivacy(key)}
                    />
                ))}
        </SectionWrapper>
    );

    // === Section Switcher ===
    const renderSection = () => {
        switch (activeSection) {
            case "profile":
                return renderProfileSection();
            case "notifications":
                return renderNotificationsSection();
            case "privacy":
                return renderPrivacySection();
            default:
                return (
                    <div className="text-center py-12 text-muted-foreground">
                        {sections.find((s) => s.id === activeSection)?.label}{" "}
                        settings coming soon...
                    </div>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="dark min-h-screen bg-background p-4 lg:p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dark min-h-screen bg-background p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-card rounded-xl shadow-xl overflow-hidden border border-border">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                        <div className="flex items-center gap-3">
                            <Settings size={28} />
                            <div>
                                <h1 className="text-2xl font-bold">Settings</h1>
                                <p className="text-indigo-100">
                                    Customize your Stream Sphere experience
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row min-h-[600px]">
                        {/* Sidebar */}
                        <div className="w-full lg:w-64 bg-muted border-b lg:border-r lg:border-b-0 border-border">
                            <nav className="p-4">
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() =>
                                                setActiveSection(section.id)
                                            }
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-2 ${
                                                activeSection === section.id
                                                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            }`}
                                        >
                                            <Icon size={20} />
                                            <span className="flex-1">
                                                {section.label}
                                            </span>
                                            <ChevronRight
                                                size={16}
                                                className={`transition-transform ${
                                                    activeSection === section.id
                                                        ? "rotate-90"
                                                        : ""
                                                }`}
                                            />
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 lg:p-8">
                            {renderSection()}

                            {/* Save Button */}
                            <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-border">
                                {isEditMode && activeSection === "profile" && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setIsEditMode(false);
                                                setAvatarFile(null);
                                                setAvatarPreview(user?.avatar || "");
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <X size={16} />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={16} />
                                                    Save Profile
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                                {(activeSection === "notifications" || activeSection === "privacy") && (
                                    <button
                                        onClick={saveSettings}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === Reusable UI Components ===
const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
            {label}
        </label>
        <input
            {...props}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
    </div>
);

const Textarea = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
            {label}
        </label>
        <textarea
            {...props}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
    </div>
);

const ToggleRow = ({ label, value, onToggle }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-foreground">{label}</span>
        <button
            onClick={onToggle}
            className={`relative w-12 h-6 rounded-full transition-colors ${
                value ? "bg-indigo-500" : "bg-muted"
            }`}
        >
            <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    value ? "translate-x-7" : "translate-x-1"
                }`}
            />
        </button>
    </div>
);

const SectionWrapper = ({ title, children }) => (
    <div className="space-y-6">
        <h4 className="text-lg font-semibold text-foreground">{title}</h4>
        <div className="space-y-4">{children}</div>
    </div>
);

export default SettingsComponent;
