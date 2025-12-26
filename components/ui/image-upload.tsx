"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, onRemove, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      onChange(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      {value ? (
        <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden border">
          <div className="absolute top-2 right-2 z-10">
            <Button
              type="button"
              onClick={onRemove}
              variant="destructive"
              size="icon"
              disabled={disabled}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          <Image
            src={value}
            alt="Image"
            className="object-cover"
            fill
            unoptimized
          />
        </div>
      ) : (
        <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-[200px] h-[200px] rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
            {isUploading ? (
                <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
            ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                    <ImagePlus className="h-10 w-10" />
                    <span className="text-sm">Upload Image</span>
                </div>
            )}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
        disabled={disabled || isUploading}
      />
    </div>
  );
}
