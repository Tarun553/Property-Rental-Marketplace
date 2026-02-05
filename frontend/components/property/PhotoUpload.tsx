"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploadProps {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
}

export function PhotoUpload({ photos, onPhotosChange }: PhotoUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

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

      // Create previews
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
      onPhotosChange([...photos, ...validFiles]);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    // Revoke the URL to free memory
    URL.revokeObjectURL(previews[index]);

    setPreviews(newPreviews);
    onPhotosChange(newPhotos);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Photos *</CardTitle>
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
            Upload at least one photo. Recommended: 5-10 high-quality images.
          </p>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="relative h-32 w-full rounded-lg overflow-hidden border">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Main Photo
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {photos.length === 0 && (
          <p className="text-sm text-red-600">At least one photo is required</p>
        )}
      </CardContent>
    </Card>
  );
}
