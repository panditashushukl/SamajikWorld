import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import React, { useState, useRef } from "react";
import { PenTool, X, Image, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { tweetService } from "../../service/tweet.service";

function CreateTweet({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + selectedImages.length > 5) {
            setError("You can only upload up to 5 images");
            return;
        }

        const validImages = files.filter(file => file.type.startsWith("image/"));
        if (validImages.length !== files.length) {
            setError("Only image files are allowed");
        }

        setSelectedImages(prev => [...prev, ...validImages]);
        setError(null);
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError("Content is required");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("content", content);
        selectedImages.forEach(image => {
            formData.append("contentImages", image);
        });

        try {
            await tweetService.postTweet(formData);
            setIsOpen(false);
            setContent("");
            setSelectedImages([]);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to post tweet");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    <button className="bg-[#ae7aff] text-black px-4 py-2 rounded-lg font-bold">
                        Tweet
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="bg-[#121212] text-white border-gray-700 max-w-xl">
                <DialogHeader className="border-b border-gray-700 pb-4">
                    <DialogTitle className="text-xl font-bold">Create Tweet</DialogTitle>
                    <DialogDescription className="text-gray-400">Share your thoughts with the world</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg flex items-center gap-2">
                            <AlertCircle size={16} />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's happening?"
                        className="w-full bg-transparent border border-gray-700 rounded-lg p-3 min-h-[150px] outline-none focus:border-[#ae7aff] transition-colors resize-none"
                    />

                    {selectedImages.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selectedImages.map((img, index) => (
                                <div key={index} className="relative w-24 h-24 border border-gray-700 rounded-lg overflow-hidden group">
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={`preview ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-black/50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                multiple
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 hover:bg-gray-800 rounded-full transition-colors text-[#ae7aff]"
                            >
                                <Image size={24} />
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <DialogClose asChild>
                                <button type="button" className="px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors">
                                    Cancel
                                </button>
                            </DialogClose>
                            <button
                                type="submit"
                                disabled={isLoading || !content.trim()}
                                className="px-6 py-2 bg-[#ae7aff] text-black font-bold rounded-lg hover:bg-[#c7aaff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? "Posting..." : "Tweet"}
                            </button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateTweet;
