"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Avatar } from "@/components/common/avatar";
import { logger } from "@/utils/logger";

export default function AccountForm({ user }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState(null);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      logger.error("Error loading user profile", {
        userId: user?.id,
        error: error.message,
      });
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true);

      // Store previous values for logging
      const previousValues = {
        full_name: fullname,
        username,
        website,
        avatar_url,
      };

      const updates = {
        id: user?.id,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;

      // Log the successful profile update
      await logger.logUserAction("profile_update", user?.id, {
        previousValues,
        newValues: updates,
        changedFields: Object.keys(updates).filter(
          (key) => updates[key] !== previousValues[key]
        ),
      });

      alert("Profile updated!");
    } catch (error) {
      logger.error("Error updating profile", {
        userId: user?.id,
        error: error.message,
      });
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="text"
          value={user?.email}
          disabled
          className="w-full p-2 border rounded-md bg-gray-50"
        />
      </div>
      <Avatar
        uid={user?.id}
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ fullname, username, website, avatar_url: url });
        }}
      />
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullname || ""}
          onChange={(e) => setFullname(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="website" className="text-sm font-medium">
          Website
        </label>
        <input
          id="website"
          type="url"
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="space-y-4">
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() =>
            updateProfile({ fullname, username, website, avatar_url })
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update Profile"}
        </button>

        <form action="/auth/signout" method="post">
          <button
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
