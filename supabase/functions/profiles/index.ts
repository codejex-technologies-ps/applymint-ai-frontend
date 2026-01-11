// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../_shared/cors.ts";

// ==========================================
// TYPES
// ==========================================

interface TokenPayload {
  sub: string;
  role?: string;
  app_metadata?: {
    role?: string;
  };
  user_metadata?: Record<string, unknown>;
}

interface ProfileData {
  id?: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone_number?: string | null;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Decode JWT token and extract payload
 */
function decodeToken(authHeader: string): TokenPayload | null {
  try {
    const token = authHeader.replace("Bearer ", "");
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

/**
 * Get user ID from token
 */
function getUserIdFromToken(authHeader: string): string | null {
  const payload = decodeToken(authHeader);
  return payload?.sub || null;
}

/**
 * Check if user has admin role by querying auth.users table
 * Admin is determined by role='admin' in auth.users table
 */
async function checkAdminRole(userId: string): Promise<boolean> {
  try {
    // Use service role client to query auth.users via admin API
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Query the auth.users table using the admin API
    const { data: { user }, error } = await serviceClient.auth.admin
      .getUserById(userId);

    if (error || !user) {
      console.error("Error fetching user:", error);
      return false;
    }

    // Check if user has admin role
    // The role can be in:
    // 1. user.role (direct role field)
    // 2. user.app_metadata.role
    // 3. user.user_metadata.role

    if (user.role === "admin" || user.role === "service_role") return true;
    if (user.app_metadata?.role === "admin") return true;
    if (user.user_metadata?.role === "admin") return true;

    return false;
  } catch (err) {
    console.error("Error checking admin role:", err);
    return false;
  }
}

/**
 * Quick check for admin role from JWT app_metadata (faster, no DB query)
 * This is used as a preliminary check, but the DB check is authoritative
 */
function isAdminFromToken(authHeader: string): boolean {
  const payload = decodeToken(authHeader);
  if (!payload) return false;

  // Check app_metadata.role from JWT
  if (payload.app_metadata?.role === "admin") return true;

  // Check if it's a service_role token
  if (payload.role === "service_role") return true;

  return false;
}

/**
 * Comprehensive admin check - checks both JWT and database
 * This ensures the role in auth.users table is respected
 */
async function isUserAdmin(
  authHeader: string,
  userId: string,
): Promise<boolean> {
  // First, quick check from JWT (for service_role tokens)
  if (isAdminFromToken(authHeader)) {
    return true;
  }

  // Then check the database for admin role
  return await checkAdminRole(userId);
}

/**
 * Create Supabase client with user's auth
 */
function createUserClient(authHeader: string) {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    },
  );
}

/**
 * Create Supabase client with service role (admin operations)
 */
function createServiceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
}

/**
 * Parse URL path to extract action and ID
 */
function parseUrlPath(url: URL): { action: string | null; id: string | null } {
  const pathParts = url.pathname.split("/").filter(Boolean);
  // Expected paths: /profiles, /profiles/:id, /profiles/bulk

  const profilesIndex = pathParts.findIndex((p) => p === "profiles");
  if (profilesIndex === -1) {
    return { action: null, id: null };
  }

  const afterProfiles = pathParts.slice(profilesIndex + 1);

  if (afterProfiles.length === 0) {
    return { action: "list", id: null };
  }

  if (afterProfiles[0] === "bulk") {
    return { action: "bulk", id: null };
  }

  // UUID pattern
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(afterProfiles[0])) {
    return { action: "single", id: afterProfiles[0] };
  }

  return { action: afterProfiles[0], id: null };
}

// ==========================================
// MAIN HANDLER
// ==========================================

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Extract user ID from JWT token
    const userId = getUserIdFromToken(authHeader);

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check if user is admin (checks both JWT and database)
    const adminUser = await isUserAdmin(authHeader, userId);

    // Create appropriate client
    const userClient = createUserClient(authHeader);
    const serviceClient = adminUser ? createServiceClient() : null;

    // Parse URL
    const url = new URL(req.url);
    const { action, id } = parseUrlPath(url);

    // Route requests
    switch (req.method) {
      case "GET":
        if (action === "list" && adminUser) {
          // GET /profiles - Admin: Get all profiles
          return await getAllProfiles(serviceClient!, url);
        } else if (action === "single" && id) {
          // GET /profiles/:id - Get profile by ID
          return await getProfileById(userClient, id, userId, adminUser);
        } else if (action === "list") {
          // GET /profiles - Regular user: Get own profile
          return await getProfileById(userClient, userId, userId, false);
        }
        break;

      case "POST":
        if (action === "bulk" && adminUser) {
          // POST /profiles/bulk - Admin: Create multiple profiles
          return await createBulkProfiles(serviceClient!, req);
        } else if (action === "list" || action === "single") {
          // POST /profiles - Create profile
          return await createProfile(userClient, req, userId, adminUser);
        }
        break;

      case "PUT":
      case "PATCH":
        if (action === "single" && id) {
          // PUT /profiles/:id - Update profile by ID
          return await updateProfile(userClient, id, userId, req, adminUser);
        }
        break;

      case "DELETE":
        if (action === "bulk" && adminUser) {
          // DELETE /profiles/bulk - Admin: Delete multiple profiles
          return await deleteBulkProfiles(serviceClient!, req);
        } else if (action === "single" && id) {
          // DELETE /profiles/:id - Delete profile by ID
          return await deleteProfile(
            userClient,
            id,
            userId,
            adminUser,
            serviceClient,
          );
        }
        break;
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed or invalid route" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

// ==========================================
// USER ENDPOINTS
// ==========================================

/**
 * GET /profiles/:id - Get profile by ID
 * Users can only get their own profile unless admin
 */
async function getProfileById(
  client: any,
  profileId: string,
  userId: string,
  isAdmin: boolean,
): Promise<Response> {
  try {
    // Non-admin users can only view their own profile
    if (!isAdmin && profileId !== userId) {
      return new Response(
        JSON.stringify({
          error: "Forbidden: You can only view your own profile",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: profile, error } = await client
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return new Response(
          JSON.stringify({ error: "Profile not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      throw error;
    }

    return new Response(
      JSON.stringify({ profile }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    throw error;
  }
}

/**
 * POST /profiles - Create a new profile
 * Regular users can only create their own profile (id must match their user id)
 * Admins can create profiles for any user
 */
async function createProfile(
  client: any,
  req: Request,
  userId: string,
  isAdmin: boolean,
): Promise<Response> {
  try {
    const profileData: ProfileData = await req.json();

    // Validate required fields
    if (!profileData.email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Non-admin users can only create their own profile
    if (!isAdmin) {
      profileData.id = userId; // Force the profile ID to be the user's ID
    } else if (!profileData.id) {
      return new Response(
        JSON.stringify({ error: "Profile ID is required for admin creation" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: profile, error } = await client
      .from("profiles")
      .insert([{
        id: profileData.id,
        email: profileData.email,
        first_name: profileData.first_name || null,
        last_name: profileData.last_name || null,
        phone_number: profileData.phone_number || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({ error: "Profile already exists" }),
          {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      throw error;
    }

    return new Response(
      JSON.stringify({ profile }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    throw error;
  }
}

/**
 * PUT /profiles/:id - Update profile by ID
 * Users can only update their own profile unless admin
 */
async function updateProfile(
  client: any,
  profileId: string,
  userId: string,
  req: Request,
  isAdmin: boolean,
): Promise<Response> {
  try {
    // Non-admin users can only update their own profile
    if (!isAdmin && profileId !== userId) {
      return new Response(
        JSON.stringify({
          error: "Forbidden: You can only update your own profile",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const updates = await req.json();

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.created_at;

    // Non-admins cannot change email
    if (!isAdmin) {
      delete updates.email;
    }

    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString();

    const { data: profile, error } = await client
      .from("profiles")
      .update(updates)
      .eq("id", profileId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return new Response(
          JSON.stringify({ error: "Profile not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      throw error;
    }

    return new Response(
      JSON.stringify({ profile }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    throw error;
  }
}

/**
 * DELETE /profiles/:id - Delete profile by ID
 * Users can only delete their own profile unless admin
 */
async function deleteProfile(
  client: any,
  profileId: string,
  userId: string,
  isAdmin: boolean,
  serviceClient: any | null,
): Promise<Response> {
  try {
    // Non-admin users can only delete their own profile
    if (!isAdmin && profileId !== userId) {
      return new Response(
        JSON.stringify({
          error: "Forbidden: You can only delete your own profile",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Use service client for admin operations, user client otherwise
    const deleteClient = isAdmin && serviceClient ? serviceClient : client;

    const { error } = await deleteClient
      .from("profiles")
      .delete()
      .eq("id", profileId);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        message: "Profile deleted successfully",
        id: profileId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    throw error;
  }
}

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * GET /profiles - Admin: Get all profiles with pagination and filtering
 * Query params: page, limit, search, sort, order
 */
async function getAllProfiles(
  serviceClient: any,
  url: URL,
): Promise<Response> {
  try {
    // Parse query parameters
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || "20"),
      100,
    );
    const search = url.searchParams.get("search") || "";
    const sortBy = url.searchParams.get("sort") || "created_at";
    const order = url.searchParams.get("order") || "desc";

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build query
    let query = serviceClient
      .from("profiles")
      .select("*", { count: "exact" });

    // Apply search filter
    if (search) {
      query = query.or(
        `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`,
      );
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: order === "asc" });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: profiles, error, count } = await query;

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        profiles,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    throw error;
  }
}

/**
 * POST /profiles/bulk - Admin: Create multiple profiles
 * Body: { profiles: ProfileData[] }
 */
async function createBulkProfiles(
  serviceClient: any,
  req: Request,
): Promise<Response> {
  try {
    const { profiles: profilesData } = await req.json();

    if (!Array.isArray(profilesData) || profilesData.length === 0) {
      return new Response(
        JSON.stringify({
          error: "profiles array is required and must not be empty",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Limit bulk operations to 100 records
    if (profilesData.length > 100) {
      return new Response(
        JSON.stringify({
          error: "Maximum 100 profiles can be created at once",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate each profile
    const errors: { index: number; error: string }[] = [];
    const validProfiles: ProfileData[] = [];

    profilesData.forEach((profile: ProfileData, index: number) => {
      if (!profile.id) {
        errors.push({ index, error: "Profile ID is required" });
      } else if (!profile.email) {
        errors.push({ index, error: "Email is required" });
      } else {
        validProfiles.push({
          id: profile.id,
          email: profile.email,
          first_name: profile.first_name || null,
          last_name: profile.last_name || null,
          phone_number: profile.phone_number || null,
        });
      }
    });

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ error: "Validation errors", details: errors }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Insert profiles
    const now = new Date().toISOString();
    const profilesWithTimestamps = validProfiles.map((p) => ({
      ...p,
      created_at: now,
      updated_at: now,
    }));

    const { data: profiles, error } = await serviceClient
      .from("profiles")
      .insert(profilesWithTimestamps)
      .select();

    if (error) {
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({
            error: "One or more profiles already exist",
            details: error.message,
          }),
          {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      throw error;
    }

    return new Response(
      JSON.stringify({
        message: `Successfully created ${profiles.length} profiles`,
        profiles,
      }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    throw error;
  }
}

/**
 * DELETE /profiles/bulk - Admin: Delete multiple profiles
 * Body: { ids: string[] }
 */
async function deleteBulkProfiles(
  serviceClient: any,
  req: Request,
): Promise<Response> {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(
        JSON.stringify({
          error: "ids array is required and must not be empty",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Limit bulk operations to 100 records
    if (ids.length > 100) {
      return new Response(
        JSON.stringify({
          error: "Maximum 100 profiles can be deleted at once",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate UUIDs
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const invalidIds = ids.filter((id: string) => !uuidPattern.test(id));

    if (invalidIds.length > 0) {
      return new Response(
        JSON.stringify({ error: "Invalid UUID format", invalidIds }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { error, count } = await serviceClient
      .from("profiles")
      .delete()
      .in("id", ids);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        message: `Successfully deleted profiles`,
        deletedCount: count || ids.length,
        ids,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    throw error;
  }
}

/*
==========================================
API DOCUMENTATION
==========================================

## Authentication
All endpoints require Bearer token authentication via the Authorization header.

## User Endpoints (Authenticated Users)

### GET /profiles/:id
Get a profile by ID. Users can only view their own profile.
Response: { profile: Profile }

### POST /profiles
Create a new profile. The profile ID will be set to the user's ID.
Body: { email: string, first_name?: string, last_name?: string, phone_number?: string }
Response: { profile: Profile }

### PUT /profiles/:id
Update a profile. Users can only update their own profile.
Body: { first_name?: string, last_name?: string, phone_number?: string }
Response: { profile: Profile }

### DELETE /profiles/:id
Delete a profile. Users can only delete their own profile.
Response: { message: string, id: string }

## Admin Endpoints (requires app_metadata.role = 'admin')

### GET /profiles
Get all profiles with pagination and filtering.
Query params: page, limit, search, sort, order
Response: { profiles: Profile[], pagination: { page, limit, total, totalPages } }

### POST /profiles/bulk
Create multiple profiles at once (max 100).
Body: { profiles: [{ id: string, email: string, first_name?: string, last_name?: string, phone_number?: string }] }
Response: { message: string, profiles: Profile[] }

### DELETE /profiles/bulk
Delete multiple profiles at once (max 100).
Body: { ids: string[] }
Response: { message: string, deletedCount: number, ids: string[] }

==========================================
CURL EXAMPLES
==========================================

# Get own profile (user)
curl -X GET 'https://<project>.supabase.co/functions/v1/profiles/<user-id>' \
  -H 'Authorization: Bearer <access_token>' \
  -H 'apikey: <anon_key>'

# Create profile (user)
curl -X POST 'https://<project>.supabase.co/functions/v1/profiles' \
  -H 'Authorization: Bearer <access_token>' \
  -H 'apikey: <anon_key>' \
  -H 'Content-Type: application/json' \
  -d '{"email": "user@example.com", "first_name": "John", "last_name": "Doe"}'

# Update profile (user)
curl -X PUT 'https://<project>.supabase.co/functions/v1/profiles/<user-id>' \
  -H 'Authorization: Bearer <access_token>' \
  -H 'apikey: <anon_key>' \
  -H 'Content-Type: application/json' \
  -d '{"first_name": "Jane", "last_name": "Smith"}'

# Delete profile (user)
curl -X DELETE 'https://<project>.supabase.co/functions/v1/profiles/<user-id>' \
  -H 'Authorization: Bearer <access_token>' \
  -H 'apikey: <anon_key>'

# Get all profiles (admin)
curl -X GET 'https://<project>.supabase.co/functions/v1/profiles?page=1&limit=20&search=john' \
  -H 'Authorization: Bearer <admin_access_token>' \
  -H 'apikey: <anon_key>'

# Create bulk profiles (admin)
curl -X POST 'https://<project>.supabase.co/functions/v1/profiles/bulk' \
  -H 'Authorization: Bearer <admin_access_token>' \
  -H 'apikey: <anon_key>' \
  -H 'Content-Type: application/json' \
  -d '{"profiles": [{"id": "uuid1", "email": "user1@example.com"}, {"id": "uuid2", "email": "user2@example.com"}]}'

# Delete bulk profiles (admin)
curl -X DELETE 'https://<project>.supabase.co/functions/v1/profiles/bulk' \
  -H 'Authorization: Bearer <admin_access_token>' \
  -H 'apikey: <anon_key>' \
  -H 'Content-Type: application/json' \
  -d '{"ids": ["uuid1", "uuid2"]}'

*/
