"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploadProps {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
  existingPhotos?: string[];
  onExistingPhotosChange?: (photos: string[]) => void;
}

export function PhotoUpload({
  photos,
  onPhotosChange,
  existingPhotos = [],
  onExistingPhotosChange,
}: PhotoUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  // Update previews when photos change (for new uploads)
  useEffect(() => {
    // Revoke old blob URLs
    previews.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    // Create new previews for new files
    const newPreviews = photos.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // Cleanup on unmount
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Validate file types
      const validFiles = newFiles.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file`);
          return false;
        }
        return true;
      });

      onPhotosChange([...photos, ...validFiles]);
    }
  };

  const removeNewPhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const removeExistingPhoto = (index: number) => {
    if (onExistingPhotosChange) {
      const newExistingPhotos = existingPhotos.filter((_, i) => i !== index);
      onExistingPhotosChange(newExistingPhotos);
    }
  };

  const totalPhotos = existingPhotos.length + photos.length;
  const isEditMode = onExistingPhotosChange !== undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Photos {!isEditMode && "*"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload">
            <Button type="button" variant="outline" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photos
              </span>
            </Button>
          </label>
          <p className="text-sm text-gray-500 mt-2">
            {isEditMode
              ? "Add more photos or remove existing ones. At least one photo is required."
              : "Upload at least one photo. Recommended: 5-10 high-quality images."}
          </p>
        </div>

        {/* Existing Photos (from server) */}
        {existingPhotos.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Current Photos ({existingPhotos.length})
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {existingPhotos.map((url, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <div className="relative h-32 w-full rounded-lg overflow-hidden border">
                    <Image
                      src={url}
                      alt={`Property photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeExistingPhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {index === 0 && photos.length === 0 && (
                    <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Main Photo
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Photos (to be uploaded) */}
        {previews.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              New Photos to Upload ({previews.length})
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previews.map((preview, index) => (
                <div key={`new-${index}`} className="relative group">
                  <div className="relative h-32 w-full rounded-lg overflow-hidden border border-green-300">
                    <Image
                      src={preview}
                      alt={`New photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeNewPhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {existingPhotos.length === 0 && index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Main Photo
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    New
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalPhotos === 0 && (
          <p className="text-sm text-red-600">At least one photo is required</p>
        )}
      </CardContent>
    </Card>
  );
}
