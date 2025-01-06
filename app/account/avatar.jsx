"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { downloadImage, revokeImageUrl } from "@/utils/storage";
import Image from "next/image";

export default function Avatar({ uid, url, size, onUpload }) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    async function loadImage() {
      if (url) {
        const { url: downloadUrl } = await downloadImage(url);
        setAvatarUrl(downloadUrl);
      }
    }

    loadImage();

    // Cleanup function
    return () => {
      if (avatarUrl) {
        revokeImageUrl(avatarUrl);
      }
    };
  }, [url]);

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Download the image immediately after upload
      const { url: downloadUrl } = await downloadImage(filePath);
      if (downloadUrl) {
        setAvatarUrl(downloadUrl);
      }

      onUpload(filePath);
    } catch (error) {
      alert("Error uploading avatar!");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
          className="avatar image rounded-full object-cover"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="avatar no-image rounded-full bg-gray-200"
          style={{ height: size, width: size }}
        />
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? "Uploading ..." : "Upload"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
