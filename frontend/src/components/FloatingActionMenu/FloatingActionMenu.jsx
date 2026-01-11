import React, { useState } from 'react';
import { Plus, Video, PenTool } from 'lucide-react';
import UploadVideo from '../UploadVideo/UploadVideo';
import CreateTweet from '../Tweet/CreateTweet';

const FloatingActionMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col-reverse items-center gap-4">
            {/* Main FAB */}
            <button
                onClick={toggleMenu}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isOpen ? 'bg-red-500 rotate-45' : 'bg-[#ae7aff]'
                    }`}
            >
                <Plus size={28} className="text-black" />
            </button>

            {/* Menu Items */}
            <div
                className={`flex flex-col gap-4 transition-all duration-300 ${isOpen
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-10 scale-0 pointer-events-none'
                    }`}
            >
                <UploadVideo>
                    <button className="group flex items-center gap-2">
                        <span className="bg-black/80 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Upload Video
                        </span>
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors border border-gray-700">
                            <Video size={20} className="text-[#ae7aff]" />
                        </div>
                    </button>
                </UploadVideo>

                <CreateTweet>
                    <button className="group flex items-center gap-2">
                        <span className="bg-black/80 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Tweet
                        </span>
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors border border-gray-700">
                            <PenTool size={20} className="text-[#ae7aff]" />
                        </div>
                    </button>
                </CreateTweet>
            </div>
        </div>
    );
};

export default FloatingActionMenu;
