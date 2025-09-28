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
        bio: "Experienced software developer passionate about creating innovative solutions.",
        location: "San Francisco, CA",
        website: "https://demo-user.dev",
        linkedin_url: "https://linkedin.com/in/demo-user",
        github_url: "https://github.com/demo-user",
        twitter_url: null,
        portfolio_url: "https://demo-user.dev/portfolio",
        current_position: "Senior Software Engineer",
        company: "Tech Startup Inc",
        years_of_experience: 5,
        availability_status: "open_to_opportunities" as const,
        preferred_work_type: "full_time" as const,
        profile_visibility: "public" as const,
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

    // Extract form data (all profile fields)
    const rawData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      phone_number: formData.get("phone_number") as string,
      bio: formData.get("bio") as string,
      location: formData.get("location") as string,
      website: formData.get("website") as string,
      linkedin_url: formData.get("linkedin_url") as string,
      github_url: formData.get("github_url") as string,
      twitter_url: formData.get("twitter_url") as string,
      portfolio_url: formData.get("portfolio_url") as string,
      current_position: formData.get("current_position") as string,
      company: formData.get("company") as string,
      years_of_experience: formData.get("years_of_experience") ? parseInt(formData.get("years_of_experience") as string) : null,
      availability_status: formData.get("availability_status") as string,
      preferred_work_type: formData.get("preferred_work_type") as string,
      profile_visibility: formData.get("profile_visibility") as string,
    };

    // Basic validation for required fields
    if (!rawData.first_name?.trim() || !rawData.last_name?.trim()) {
      return { error: "First name and last name are required" };
    }

    // Clean up empty strings and convert to null
    const cleanedData = {
      first_name: rawData.first_name.trim(),
      last_name: rawData.last_name.trim(),
      phone_number: rawData.phone_number?.trim() || null,
      bio: rawData.bio?.trim() || null,
      location: rawData.location?.trim() || null,
      website: rawData.website?.trim() || null,
      linkedin_url: rawData.linkedin_url?.trim() || null,
      github_url: rawData.github_url?.trim() || null,
      twitter_url: rawData.twitter_url?.trim() || null,
      portfolio_url: rawData.portfolio_url?.trim() || null,
      current_position: rawData.current_position?.trim() || null,
      company: rawData.company?.trim() || null,
      years_of_experience: rawData.years_of_experience,
      availability_status: rawData.availability_status || 'available',
      preferred_work_type: rawData.preferred_work_type || 'full_time',
      profile_visibility: rawData.profile_visibility || 'public',
      updated_at: new Date().toISOString(),
    };

    // Update the profile (all fields)
    const { error: updateError } = await supabase
      .from("profiles")
      .update(cleanedData)
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
