"use client";

import { useState } from 'react';
import { uploadFile, deleteFile } from '@/lib/appwrite';
import type { FileAttachment } from '@/types';
import { Icons } from '../ui/icons';
import { useAuth } from '@/hooks/useAuth';

interface FileUploaderProps {
  onFilesUploaded: (files: string) => void;
  initialFiles?: string;
  capsuleId: string;
}

export function FileUploader({ onFilesUploaded, initialFiles, capsuleId }: FileUploaderProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>(() => {
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
    if (!e.target.files?.length || !user) {
      if (!user) {
        alert("You must be logged in to upload files.");
      }
      return;
    }

    try {
      setIsUploading(true);
      const newFiles: FileAttachment[] = [];

      for (const file of Array.from(e.target.files)) {
        // Pass both userId and capsuleId to uploadFile
        const uploadedFile = await uploadFile(file, user.userId, capsuleId);
        newFiles.push(uploadedFile);
      }

      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onFilesUploaded(JSON.stringify(updatedFiles));
    } catch (error) {
      console.error(error);
      alert("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = async (fileId: string) => {
    if (!user) return;

    try {
      await deleteFile(fileId, user.userId);
      const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
      setUploadedFiles(updatedFiles);
      onFilesUploaded(JSON.stringify(updatedFiles));
    } catch (error) {
      console.error('Error removing file:', error);
      alert('Failed to remove file. Please try again.');
    }
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
