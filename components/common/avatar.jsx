"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { Camera, Loader2, User } from "lucide-react";
import { toast } from "sonner";

export function Avatar({ uid, url, size = 100, onUpload }) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let objectUrl = null;

    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);

        if (error) {
          throw error;
        }

        objectUrl = URL.createObjectURL(data);
        setAvatarUrl(objectUrl);
      } catch (error) {
        console.error("Error downloading image:", error.message);
        setError("Error accessing image");
        setAvatarUrl(null);
      }
    }

    if (url) {
      if (url.startsWith("http")) {
        setAvatarUrl(url);
      } else {
        downloadImage(url);
      }
    }

    // Cleanup function
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url, supabase]);

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);
      setError(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Du skal vælge et billede at uploade");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${uid}-${Date.now()}.${fileExt}`.toLowerCase();

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Update the user's profile with the new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: fileName })
        .eq("id", uid);

      if (updateError) throw updateError;

      // Set the avatar URL directly from the file
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      onUpload(fileName);
      toast.success("Profilbillede opdateret");

      // Clean up the old object URL
      return () => URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message);
      toast.error("Fejl ved upload af billede");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div
          className={cn(
            "relative rounded-full overflow-hidden bg-muted",
            "border-2 border-border hover:border-primary transition-colors"
          )}
          style={{ width: size, height: size }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Image load error for URL:", avatarUrl);
                console.error("Error details:", e.target.error);
                setError("Failed to load image");
                setAvatarUrl(null);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-1/2 h-1/2 text-muted-foreground" />
            </div>
          )}
          <label
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer",
              uploading && "cursor-not-allowed"
            )}
            htmlFor="single"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </label>
          <input
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            className="hidden"
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
