"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { downloadImage, revokeImageUrl } from "@/utils/storage";
import { useUser } from "@/components/providers/user-provider";
import Image from "next/image";

export function Avatar({ uid, url, size, onUpload, hideUpload = false }) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const { user, updateUser } = useUser();

  useEffect(() => {
    let ignore = false;

    async function loadImage() {
      if (url) {
        try {
          const { url: downloadUrl } = await downloadImage(url);
          if (!ignore) {
            setAvatarUrl(downloadUrl);
          }
        } catch (error) {
          console.error("Error loading avatar:", error);
        }
      } else {
        setAvatarUrl(null);
      }
    }

    loadImage();

    return () => {
      ignore = true;
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

      // Update the database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("id", uid);

      if (updateError) throw updateError;

      // Update local state for immediate feedback
      const { url: downloadUrl } = await downloadImage(filePath);
      if (downloadUrl) {
        setAvatarUrl(downloadUrl);

        // Update the user context with the new avatar_url
        updateUser({
          ...user,
          avatar_url: filePath,
        });
      }

      // Call the onUpload callback if provided
      if (onUpload) {
        onUpload(filePath);
      }
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
      {!hideUpload && (
        <div style={{ width: size }}>
          <label
            className="button primary block"
            htmlFor={`avatar-upload-${uid}`}
          >
            {uploading ? "Uploading ..." : "Upload"}
          </label>
          <input
            id={`avatar-upload-${uid}`}
            style={{
              visibility: "hidden",
              position: "absolute",
            }}
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
}
