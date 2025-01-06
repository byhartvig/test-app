"use client";

import { useEffect, useState } from "react";
import { getClientUserWithProfile } from "@/utils/auth-client";
import { downloadImage, revokeImageUrl } from "@/utils/storage";

export function UserProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const { user, profile } = await getClientUserWithProfile();
        setUser(user);
        setProfile(profile);

        if (profile?.avatar_url) {
          const { url } = await downloadImage(profile.avatar_url);
          setAvatarUrl(url);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();

    return () => {
      if (avatarUrl) {
        revokeImageUrl(avatarUrl);
      }
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Welcome, {profile?.username || user.email}
      </h2>
      {profile && (
        <div className="space-y-2">
          <p>Username: {profile.username}</p>
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
}
