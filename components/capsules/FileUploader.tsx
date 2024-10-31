"use client";

import { useState } from 'react';
import { uploadFile } from '@/lib/appwrite';
import type { FileAttachment } from '@/types';
import { Icons } from '../ui/icons';
import { useAuth } from '@/hooks/useAuth';

interface FileUploaderProps {
  onFilesUploaded: (files: string) => void;
  initialFiles?: string;
}

export function FileUploader({ onFilesUploaded, initialFiles }: FileUploaderProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>(() => {
    // Parse initial files if provided
    if (initialFiles) {
      try {
        return JSON.parse(initialFiles);
      } catch {
        return [];
      }
    }
    return [];
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    if (!user) {
      console.error("User is not authenticated.");
      alert("You must be logged in to upload files.");
      return;
    }

    try {
      setIsUploading(true);
      const newFiles: FileAttachment[] = [];

      for (const file of Array.from(e.target.files)) {
        const uploadedFile = await uploadFile(file);
        newFiles.push(uploadedFile);
      }

      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onFilesUploaded(JSON.stringify(updatedFiles)); // Convert to JSON string
    } catch (error) {
      console.error(error);
      alert("Failed to upload files. Please check your permissions and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesUploaded(JSON.stringify(updatedFiles)); // Convert to JSON string
  };

  return (
    <div className="mt-1 flex flex-col">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-4">
          {isUploading ? (
            <Icons.spinner className="h-5 w-5 animate-spin" />
          ) : (
            <span>Upload files</span>
          )}
        </div>
      </label>
      <div className="mt-2">
        {uploadedFiles.map((file) => (
          <div key={file.id} className="flex justify-between items-center">
            <span>{file.name}</span>
            <button
              onClick={() => handleRemoveFile(file.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
