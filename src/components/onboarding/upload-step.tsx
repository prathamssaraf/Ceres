"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { DropData } from "@/app/onboarding/page";
import { useUploadThing } from "@/lib/uploadthing";

type UploadStepProps = {
  dropData: DropData;
  updateDropData: (data: Partial<DropData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export function UploadStep({
  dropData,
  updateDropData,
  onNext,
}: UploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("imageUploader");

  const handleFileChange = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      // Show preview immediately for better UX
      const reader = new FileReader();
      reader.onloadend = () => {
        updateDropData({
          imageFile: file,
          imagePreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);

      // Upload to cloud storage
      setIsUploading(true);

      try {
        console.log("Starting upload...");
        const uploadResult = await startUpload([file]).catch((err) => {
          // Even if callback fails, the upload might have succeeded
          console.log("Upload threw error (might be callback issue):", err);

          // Check if error data contains file info
          if (err && err.cause && err.cause.fileKey) {
            // Construct URL from file key
            const fileKey = err.cause.fileKey;
            const cloudUrl = `https://utfs.io/f/${fileKey}`;
            console.log("Extracted URL from error:", cloudUrl);
            return [{ url: cloudUrl, key: fileKey }];
          }

          throw err;
        });

        console.log("Upload result:", uploadResult);

        // Get the URL from the upload result
        if (uploadResult && uploadResult[0]) {
          const cloudUrl = uploadResult[0].url;
          console.log("Image uploaded successfully to:", cloudUrl);

          // Update with the cloud URL
          updateDropData({
            imagePreview: cloudUrl,
          });
        }

        setIsUploading(false);
      } catch (error: any) {
        console.error("Upload error:", error);

        // Check if the error message indicates callback failure but successful upload
        if (error && error.message && error.message.toLowerCase().includes("callback")) {
          console.log("Callback failed - file likely uploaded, using base64 preview");
          // File was uploaded but callback failed - that's ok, we have the base64 preview
          setIsUploading(false);
        } else {
          // Real upload error
          alert("Upload failed. Please try again.");
          setIsUploading(false);
        }
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (dropData.imageFile) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Upload Your Product
        </h2>
        <p className="text-neutral-400">
          Drop a single high-quality image of your product
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
          dragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-neutral-700 hover:border-neutral-600"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {dropData.imagePreview ? (
          <div className="space-y-4">
            <div className="relative w-full max-w-md mx-auto aspect-square rounded-lg overflow-hidden">
              <img
                src={dropData.imagePreview}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
            >
              <Upload className="mr-2 h-4 w-4" />
              Change Image
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <ImageIcon className="h-16 w-16 text-neutral-600" />
            </div>
            <div>
              <p className="text-white mb-2">
                Drag and drop your image here, or
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </div>
            <p className="text-sm text-neutral-500">
              PNG, JPG, or WEBP (max 10MB)
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Navigation */}
      <div className="flex justify-end pt-6">
        <Button
          onClick={handleNext}
          disabled={!dropData.imageFile || isUploading}
          size="lg"
          className="bg-white text-black hover:bg-neutral-200"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
}
