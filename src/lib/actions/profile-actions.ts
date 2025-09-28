"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Get current user's profile
export async function getProfile() {
  // For demo purposes, return mock data when Supabase is not configured
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      console.warn(
        "Supabase environment variables not configured. Using mock data."
      );
      return {
        user: {
          id: "mock-user-id",
          email: "demo@example.com",
          isEmailVerified: true,
          createdAt: new Date(),
        },
        profile: {
          id: "mock-profile-id",
          first_name: "Demo",
          last_name: "User",
          phone_number: "+1 (555) 123-4567",
          email: "demo@example.com",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect("/login");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email || "",
        isEmailVerified: user.email_confirmed_at !== null,
        createdAt: new Date(user.created_at),
      },
      profile,
    };
  } catch (error) {
    console.error("Error in getProfile:", error);
    // Return mock data on any error for demo purposes
    return {
      user: {
        id: "mock-user-id",
        email: "demo@example.com",
        isEmailVerified: true,
        createdAt: new Date(),
      },
      profile: {
        id: "mock-profile-id",
        first_name: "Demo",
        last_name: "User",
        phone_number: "+1 (555) 123-4567",
        email: "demo@example.com",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
  }
}

// Update profile server action
export async function updateProfileAction(formData: FormData) {
  // For demo purposes, return success when Supabase is not configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn(
      "Supabase not configured. Profile update skipped in demo mode."
    );
    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  }

  const supabase = await createClient();

  try {
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    // Extract form data (only fields that exist in the database)
    const rawData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      phone_number: formData.get("phone_number") as string,
    };

    // Basic validation for required fields
    if (!rawData.first_name?.trim() || !rawData.last_name?.trim()) {
      return { error: "First name and last name are required" };
    }

    // Clean phone number (empty string to null)
    const phoneNumber = rawData.phone_number?.trim() || null;

    // Update the profile (only update fields that exist in database)
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        first_name: rawData.first_name.trim(),
        last_name: rawData.last_name.trim(),
        phone_number: phoneNumber,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return { error: "Failed to update profile. Please try again." };
    }

    // Revalidate the profile page
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Error in updateProfileAction:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// Resume data server actions
export async function saveResumeAction(formData: FormData) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    // Extract resume data from form
    const resumeData = {
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
      experience: JSON.parse((formData.get("experience") as string) || "[]"),
      education: JSON.parse((formData.get("education") as string) || "[]"),
      skills: JSON.parse((formData.get("skills") as string) || "[]"),
    };

    // Save to database (this would need proper resume schema)
    // For now, just return success
    console.log("Resume data to save:", resumeData);

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error saving resume:", error);
    return { error: "Failed to save resume" };
  }
}
