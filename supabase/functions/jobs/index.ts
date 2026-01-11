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
}

interface JobFilters {
  page?: number;
  limit?: number;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  isRemote?: boolean;
  companyId?: string;
  categoryId?: string;
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  query?: string;
  sort?: string;
  order?: "asc" | "desc";
}

interface CompanyData {
  id?: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  industry?: string;
  size?: string;
  location?: string;
}

interface CategoryData {
  id?: string;
  name: string;
  description?: string;
  parent_id?: string;
}

interface JobData {
  id?: string;
  title: string;
  location: string;
  is_remote?: boolean;
  job_type?: string;
  experience_level?: string;
  description: string; // Markdown format
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  skills?: string[];
  application_deadline?: string;
  external_job_id?: string;
  external_source?: string;
  // Nested data for creation
  company?: CompanyData;
  company_id?: string;
  categories?: CategoryData[];
  category_ids?: string[];
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
 */
async function checkAdminRole(userId: string): Promise<boolean> {
  try {
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const {
      data: { user },
      error,
    } = await serviceClient.auth.admin.getUserById(userId);

    if (error || !user) {
      console.error("Error fetching user:", error);
      return false;
    }

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
 * Quick check for admin role from JWT
 */
function isAdminFromToken(authHeader: string): boolean {
  const payload = decodeToken(authHeader);
  if (!payload) return false;
  if (payload.app_metadata?.role === "admin") return true;
  if (payload.role === "service_role") return true;
  return false;
}

/**
 * Comprehensive admin check
 */
async function isUserAdmin(
  authHeader: string,
  userId: string,
): Promise<boolean> {
  if (isAdminFromToken(authHeader)) return true;
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
        headers: { Authorization: authHeader },
      },
    },
  );
}

/**
 * Create Supabase client with service role
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
  const jobsIndex = pathParts.findIndex((p) => p === "jobs");

  if (jobsIndex === -1) {
    return { action: null, id: null };
  }

  const afterJobs = pathParts.slice(jobsIndex + 1);

  if (afterJobs.length === 0) {
    return { action: "list", id: null };
  }

  if (afterJobs[0] === "bulk") {
    return { action: "bulk", id: null };
  }

  if (afterJobs[0] === "save") {
    // /jobs/save or /jobs/save/:jobId
    if (afterJobs[1]) {
      return { action: "save", id: afterJobs[1] };
    }
    return { action: "save", id: null };
  }

  if (afterJobs[0] === "saved") {
    return { action: "saved", id: null };
  }

  // UUID pattern
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(afterJobs[0])) {
    return { action: "single", id: afterJobs[0] };
  }

  return { action: afterJobs[0], id: null };
}

/**
 * Parse job filters from query params
 */
function parseJobFilters(searchParams: URLSearchParams): JobFilters {
  return {
    page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
    limit: searchParams.get("limit")
      ? Math.min(parseInt(searchParams.get("limit")!), 100)
      : 20,
    location: searchParams.get("location") || undefined,
    jobType: searchParams.get("jobType") || undefined,
    experienceLevel: searchParams.get("experienceLevel") || undefined,
    isRemote: searchParams.get("isRemote")
      ? searchParams.get("isRemote") === "true"
      : undefined,
    companyId: searchParams.get("companyId") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    skills: searchParams.get("skills")
      ? searchParams.get("skills")!.split(",")
      : undefined,
    salaryMin: searchParams.get("salaryMin")
      ? parseInt(searchParams.get("salaryMin")!)
      : undefined,
    salaryMax: searchParams.get("salaryMax")
      ? parseInt(searchParams.get("salaryMax")!)
      : undefined,
    query: searchParams.get("query") || undefined,
    sort: searchParams.get("sort") || "posted_at",
    order: (searchParams.get("order") as "asc" | "desc") || "desc",
  };
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
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is admin
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
        if (action === "single" && id) {
          // GET /jobs/:id - Get job by ID (all users)
          return await getJobById(userClient, id);
        } else if (action === "saved") {
          // GET /jobs/saved - Get user's saved jobs
          return await getSavedJobs(userClient, userId, url);
        } else if (action === "list") {
          // GET /jobs - Get all jobs with filters (all users)
          const filters = parseJobFilters(url.searchParams);
          return await getJobs(userClient, filters);
        }
        break;

      case "POST":
        if (action === "bulk" && adminUser) {
          // POST /jobs/bulk - Admin: Create multiple jobs
          return await createBulkJobs(serviceClient!, req);
        } else if (action === "save" && id) {
          // POST /jobs/save/:jobId - Save a job (all users)
          return await saveJob(userClient, id, userId, req);
        } else if (action === "list" && adminUser) {
          // POST /jobs - Admin: Create single job
          return await createJob(serviceClient!, req);
        } else if (action === "list" && !adminUser) {
          return new Response(
            JSON.stringify({ error: "Forbidden: Admin access required" }),
            {
              status: 403,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        break;

      case "PUT":
      case "PATCH":
        if (action === "single" && id && adminUser) {
          // PUT /jobs/:id - Admin: Update job
          return await updateJob(serviceClient!, id, req);
        } else if (action === "single" && id && !adminUser) {
          return new Response(
            JSON.stringify({ error: "Forbidden: Admin access required" }),
            {
              status: 403,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        break;

      case "DELETE":
        if (action === "save" && id) {
          // DELETE /jobs/save/:jobId - Unsave a job (all users)
          return await unsaveJob(userClient, id, userId);
        } else if (action === "single" && id && adminUser) {
          // DELETE /jobs/:id - Admin: Delete job
          return await deleteJob(serviceClient!, id);
        } else if (action === "single" && id && !adminUser) {
          return new Response(
            JSON.stringify({ error: "Forbidden: Admin access required" }),
            {
              status: 403,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
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
// PUBLIC ENDPOINTS (All Users)
// ==========================================

/**
 * GET /jobs - Get all jobs with filters and pagination
 */
async function getJobs(
  client: ReturnType<typeof createUserClient>,
  filters: JobFilters,
): Promise<Response> {
  try {
    // Build query with company join
    let query = client
      .from("jobs")
      .select(
        `
        *,
        companies (
          id,
          name,
          logo_url,
          industry,
          location
        ),
        job_category_mappings (
          category_id,
          job_categories (
            id,
            name,
            parent_id
          )
        )
      `,
        { count: "exact" },
      )
      .eq("is_active", true);

    // Apply filters
    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    if (filters.jobType) {
      query = query.eq("job_type", filters.jobType);
    }

    if (filters.experienceLevel) {
      query = query.eq("experience_level", filters.experienceLevel);
    }

    if (filters.isRemote !== undefined) {
      query = query.eq("is_remote", filters.isRemote);
    }

    if (filters.companyId) {
      query = query.eq("company_id", filters.companyId);
    }

    if (filters.salaryMin) {
      query = query.gte("salary_min", filters.salaryMin);
    }

    if (filters.salaryMax) {
      query = query.lte("salary_max", filters.salaryMax);
    }

    if (filters.query) {
      query = query.or(
        `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`,
      );
    }

    if (filters.skills && filters.skills.length > 0) {
      query = query.overlaps("skills", filters.skills);
    }

    // Apply sorting
    query = query.order(filters.sort!, { ascending: filters.order === "asc" });

    // Apply pagination
    const from = (filters.page! - 1) * filters.limit!;
    const to = from + filters.limit! - 1;
    query = query.range(from, to);

    const { data: jobs, error, count } = await query;

    if (error) throw error;

    // If categoryId filter is provided, filter by category
    let filteredJobs = jobs;
    if (filters.categoryId && jobs) {
      filteredJobs = jobs.filter((job: any) =>
        job.job_category_mappings?.some(
          (mapping: any) => mapping.category_id === filters.categoryId,
        )
      );
    }

    return new Response(
      JSON.stringify({
        jobs: filteredJobs,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / filters.limit!),
          hasNextPage: filters.page! * filters.limit! < (count || 0),
          hasPrevPage: filters.page! > 1,
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
 * GET /jobs/:id - Get single job by ID
 */
async function getJobById(
  client: ReturnType<typeof createUserClient>,
  jobId: string,
): Promise<Response> {
  try {
    const { data: job, error } = await client
      .from("jobs")
      .select(
        `
        *,
        companies (
          id,
          name,
          description,
          logo_url,
          industry,
          website,
          size,
          location
        ),
        job_category_mappings (
          category_id,
          job_categories (
            id,
            name,
            description,
            parent_id
          )
        )
      `,
      )
      .eq("id", jobId)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return new Response(JSON.stringify({ error: "Job not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw error;
    }

    return new Response(JSON.stringify({ job }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    throw error;
  }
}

/**
 * POST /jobs/save/:jobId - Save a job
 */
async function saveJob(
  client: ReturnType<typeof createUserClient>,
  jobId: string,
  userId: string,
  req: Request,
): Promise<Response> {
  try {
    // Check if job exists
    const { data: job, error: jobError } = await client
      .from("jobs")
      .select("id")
      .eq("id", jobId)
      .eq("is_active", true)
      .single();

    if (jobError || !job) {
      return new Response(JSON.stringify({ error: "Job not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get optional notes from body
    let notes: string | null = null;
    try {
      const body = await req.json();
      notes = body.notes || null;
    } catch {
      // No body provided
    }

    // Save the job
    const { data: savedJob, error } = await client
      .from("saved_jobs")
      .upsert(
        [
          {
            job_id: jobId,
            user_id: userId,
            notes,
            saved_at: new Date().toISOString(),
          },
        ],
        { onConflict: "job_id,user_id" },
      )
      .select(
        `
        *,
        jobs (
          id,
          title,
          location,
          companies (
            id,
            name,
            logo_url
          )
        )
      `,
      )
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: "Job saved successfully", savedJob }),
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
 * DELETE /jobs/save/:jobId - Unsave a job
 */
async function unsaveJob(
  client: ReturnType<typeof createUserClient>,
  jobId: string,
  userId: string,
): Promise<Response> {
  try {
    const { error } = await client
      .from("saved_jobs")
      .delete()
      .eq("job_id", jobId)
      .eq("user_id", userId);

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: "Job removed from saved jobs", jobId }),
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
 * GET /jobs/saved - Get user's saved jobs
 */
async function getSavedJobs(
  client: ReturnType<typeof createUserClient>,
  userId: string,
  url: URL,
): Promise<Response> {
  try {
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || "20"),
      100,
    );
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: savedJobs, error, count } = await client
      .from("saved_jobs")
      .select(
        `
        *,
        jobs (
          *,
          companies (
            id,
            name,
            logo_url,
            industry
          )
        )
      `,
        { count: "exact" },
      )
      .eq("user_id", userId)
      .order("saved_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return new Response(
      JSON.stringify({
        savedJobs,
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

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * POST /jobs - Admin: Create a single job
 * Can also create/reference company and categories
 */
async function createJob(
  client: ReturnType<typeof createServiceClient>,
  req: Request,
): Promise<Response> {
  try {
    const jobData: JobData = await req.json();

    // Validate required fields
    if (!jobData.title) {
      return new Response(JSON.stringify({ error: "title is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!jobData.location) {
      return new Response(JSON.stringify({ error: "location is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!jobData.description) {
      return new Response(
        JSON.stringify({
          error: "description is required (markdown format supported)",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let companyId = jobData.company_id;

    // Handle company creation if nested company data is provided
    if (jobData.company && !companyId) {
      const companyResult = await createOrGetCompany(client, jobData.company);
      if (companyResult.error) {
        return new Response(
          JSON.stringify({ error: companyResult.error }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      companyId = companyResult.id;
    }

    // Verify company exists if provided
    if (companyId) {
      const { data: company, error: companyError } = await client
        .from("companies")
        .select("id")
        .eq("id", companyId)
        .single();

      if (companyError || !company) {
        return new Response(
          JSON.stringify({ error: "Invalid company_id" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // Handle categories creation
    let categoryIds: string[] = jobData.category_ids || [];
    if (jobData.categories && jobData.categories.length > 0) {
      const categoryResults = await createOrGetCategories(
        client,
        jobData.categories,
      );
      categoryIds = [...categoryIds, ...categoryResults];
    }

    // Create the job
    const now = new Date().toISOString();
    const { data: job, error: jobError } = await client
      .from("jobs")
      .insert([
        {
          title: jobData.title,
          company_id: companyId || null,
          location: jobData.location,
          is_remote: jobData.is_remote || false,
          job_type: jobData.job_type || null,
          experience_level: jobData.experience_level || null,
          description: jobData.description,
          requirements: jobData.requirements || [],
          responsibilities: jobData.responsibilities || [],
          benefits: jobData.benefits || [],
          salary_min: jobData.salary_min || null,
          salary_max: jobData.salary_max || null,
          salary_currency: jobData.salary_currency || "USD",
          skills: jobData.skills || [],
          application_deadline: jobData.application_deadline || null,
          external_job_id: jobData.external_job_id || null,
          external_source: jobData.external_source || null,
          is_active: true,
          posted_at: now,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    if (jobError) throw jobError;

    // Create category mappings
    if (categoryIds.length > 0) {
      const mappings = categoryIds.map((categoryId) => ({
        job_id: job.id,
        category_id: categoryId,
      }));

      const { error: mappingError } = await client
        .from("job_category_mappings")
        .insert(mappings);

      if (mappingError) {
        console.error("Error creating category mappings:", mappingError);
      }
    }

    // Fetch complete job with relations
    const { data: completeJob, error: fetchError } = await client
      .from("jobs")
      .select(
        `
        *,
        companies (
          id,
          name,
          logo_url,
          industry
        ),
        job_category_mappings (
          category_id,
          job_categories (
            id,
            name,
            parent_id
          )
        )
      `,
      )
      .eq("id", job.id)
      .single();

    if (fetchError) throw fetchError;

    return new Response(JSON.stringify({ job: completeJob }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    throw error;
  }
}

/**
 * POST /jobs/bulk - Admin: Create multiple jobs
 */
async function createBulkJobs(
  client: ReturnType<typeof createServiceClient>,
  req: Request,
): Promise<Response> {
  try {
    const { jobs: jobsData } = await req.json();

    if (!Array.isArray(jobsData) || jobsData.length === 0) {
      return new Response(
        JSON.stringify({
          error: "jobs array is required and must not be empty",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (jobsData.length > 100) {
      return new Response(
        JSON.stringify({ error: "Maximum 100 jobs can be created at once" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const results: any[] = [];
    const errors: { index: number; error: string }[] = [];
    const now = new Date().toISOString();

    // Process each job
    for (let i = 0; i < jobsData.length; i++) {
      const jobData = jobsData[i];

      try {
        // Validate required fields
        if (!jobData.title) {
          errors.push({ index: i, error: "title is required" });
          continue;
        }
        if (!jobData.location) {
          errors.push({ index: i, error: "location is required" });
          continue;
        }
        if (!jobData.description) {
          errors.push({ index: i, error: "description is required" });
          continue;
        }

        let companyId = jobData.company_id;

        // Handle company creation if nested
        if (jobData.company && !companyId) {
          const companyResult = await createOrGetCompany(
            client,
            jobData.company,
          );
          if (companyResult.error) {
            errors.push({ index: i, error: companyResult.error });
            continue;
          }
          companyId = companyResult.id;
        }

        // Handle categories
        let categoryIds: string[] = jobData.category_ids || [];
        if (jobData.categories && jobData.categories.length > 0) {
          const categoryResults = await createOrGetCategories(
            client,
            jobData.categories,
          );
          categoryIds = [...categoryIds, ...categoryResults];
        }

        // Create job
        const { data: job, error: jobError } = await client
          .from("jobs")
          .insert([
            {
              title: jobData.title,
              company_id: companyId || null,
              location: jobData.location,
              is_remote: jobData.is_remote || false,
              job_type: jobData.job_type || null,
              experience_level: jobData.experience_level || null,
              description: jobData.description,
              requirements: jobData.requirements || [],
              responsibilities: jobData.responsibilities || [],
              benefits: jobData.benefits || [],
              salary_min: jobData.salary_min || null,
              salary_max: jobData.salary_max || null,
              salary_currency: jobData.salary_currency || "USD",
              skills: jobData.skills || [],
              application_deadline: jobData.application_deadline || null,
              external_job_id: jobData.external_job_id || null,
              external_source: jobData.external_source || null,
              is_active: true,
              posted_at: now,
              created_at: now,
              updated_at: now,
            },
          ])
          .select()
          .single();

        if (jobError) {
          errors.push({ index: i, error: jobError.message });
          continue;
        }

        // Create category mappings
        if (categoryIds.length > 0) {
          const mappings = categoryIds.map((categoryId) => ({
            job_id: job.id,
            category_id: categoryId,
          }));

          await client.from("job_category_mappings").insert(mappings);
        }

        results.push(job);
      } catch (err) {
        errors.push({
          index: i,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Created ${results.length} jobs`,
        jobs: results,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: errors.length === jobsData.length ? 400 : 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    throw error;
  }
}

/**
 * PUT /jobs/:id - Admin: Update a job
 */
async function updateJob(
  client: ReturnType<typeof createServiceClient>,
  jobId: string,
  req: Request,
): Promise<Response> {
  try {
    const updates = await req.json();

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.created_at;
    delete updates.posted_at;

    // Handle categories update
    const categoryIds = updates.category_ids;
    const categories = updates.categories;
    delete updates.category_ids;
    delete updates.categories;

    // Handle company update
    if (updates.company && !updates.company_id) {
      const companyResult = await createOrGetCompany(client, updates.company);
      if (!companyResult.error) {
        updates.company_id = companyResult.id;
      }
    }
    delete updates.company;

    // Add updated timestamp
    updates.updated_at = new Date().toISOString();

    const { data: job, error } = await client
      .from("jobs")
      .update(updates)
      .eq("id", jobId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return new Response(JSON.stringify({ error: "Job not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw error;
    }

    // Update category mappings if provided
    if (categoryIds || categories) {
      // Delete existing mappings
      await client.from("job_category_mappings").delete().eq("job_id", jobId);

      // Create new mappings
      let newCategoryIds: string[] = categoryIds || [];
      if (categories && categories.length > 0) {
        const categoryResults = await createOrGetCategories(client, categories);
        newCategoryIds = [...newCategoryIds, ...categoryResults];
      }

      if (newCategoryIds.length > 0) {
        const mappings = newCategoryIds.map((catId) => ({
          job_id: jobId,
          category_id: catId,
        }));
        await client.from("job_category_mappings").insert(mappings);
      }
    }

    // Fetch complete job
    const { data: completeJob, error: fetchError } = await client
      .from("jobs")
      .select(
        `
        *,
        companies (
          id,
          name,
          logo_url,
          industry
        ),
        job_category_mappings (
          category_id,
          job_categories (
            id,
            name,
            parent_id
          )
        )
      `,
      )
      .eq("id", jobId)
      .single();

    if (fetchError) throw fetchError;

    return new Response(JSON.stringify({ job: completeJob }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    throw error;
  }
}

/**
 * DELETE /jobs/:id - Admin: Delete a job (soft delete)
 */
async function deleteJob(
  client: ReturnType<typeof createServiceClient>,
  jobId: string,
): Promise<Response> {
  try {
    // Soft delete by setting is_active to false
    const { data: job, error } = await client
      .from("jobs")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .select("id")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return new Response(JSON.stringify({ error: "Job not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw error;
    }

    return new Response(
      JSON.stringify({ message: "Job deleted successfully", id: jobId }),
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
// HELPER FUNCTIONS FOR DEPENDENT ENTITIES
// ==========================================

/**
 * Create or get existing company
 */
async function createOrGetCompany(
  client: ReturnType<typeof createServiceClient>,
  companyData: CompanyData,
): Promise<{ id?: string; error?: string }> {
  try {
    if (!companyData.name) {
      return { error: "Company name is required" };
    }

    // Check if company with same name exists
    const { data: existing, error: searchError } = await client
      .from("companies")
      .select("id")
      .ilike("name", companyData.name)
      .maybeSingle();

    if (searchError) {
      console.error("Error searching company:", searchError);
    }

    if (existing) {
      return { id: existing.id };
    }

    // Create new company
    const now = new Date().toISOString();
    const { data: company, error } = await client
      .from("companies")
      .insert([
        {
          name: companyData.name,
          description: companyData.description || null,
          website: companyData.website || null,
          logo_url: companyData.logo_url || null,
          industry: companyData.industry || null,
          size: companyData.size || null,
          location: companyData.location || null,
          created_at: now,
          updated_at: now,
        },
      ])
      .select("id")
      .single();

    if (error) {
      return { error: `Failed to create company: ${error.message}` };
    }

    return { id: company.id };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Create or get existing categories
 * Supports hierarchical categories (domains/subdomains)
 */
async function createOrGetCategories(
  client: ReturnType<typeof createServiceClient>,
  categories: CategoryData[],
): Promise<string[]> {
  const categoryIds: string[] = [];

  for (const category of categories) {
    try {
      if (!category.name) continue;

      // Check if category exists
      const { data: existing, error: searchError } = await client
        .from("job_categories")
        .select("id")
        .ilike("name", category.name)
        .maybeSingle();

      if (searchError) {
        console.error("Error searching category:", searchError);
      }

      if (existing) {
        categoryIds.push(existing.id);
        continue;
      }

      // Handle parent category if provided
      let parentId = category.parent_id || null;

      // Create new category
      const { data: newCategory, error } = await client
        .from("job_categories")
        .insert([
          {
            name: category.name,
            description: category.description || null,
            parent_id: parentId,
            created_at: new Date().toISOString(),
          },
        ])
        .select("id")
        .single();

      if (error) {
        console.error("Error creating category:", error);
        continue;
      }

      categoryIds.push(newCategory.id);
    } catch (err) {
      console.error("Error processing category:", err);
    }
  }

  return categoryIds;
}

/*
==========================================
API DOCUMENTATION
==========================================

## Authentication
All endpoints require Bearer token authentication.

## Public Endpoints (All Users)

### GET /jobs
Get all active jobs with filters and pagination.
Query params:
  - page (default: 1)
  - limit (default: 20, max: 100)
  - location (partial match)
  - jobType (FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE)
  - experienceLevel (ENTRY, MID, SENIOR, EXECUTIVE)
  - isRemote (true/false)
  - companyId (UUID)
  - categoryId (UUID)
  - skills (comma-separated)
  - salaryMin (number)
  - salaryMax (number)
  - query (search in title and description)
  - sort (field to sort by, default: posted_at)
  - order (asc/desc, default: desc)

### GET /jobs/:id
Get a single job by ID with company and category details.

### POST /jobs/save/:jobId
Save a job to user's saved jobs list.
Body (optional): { "notes": "string" }

### DELETE /jobs/save/:jobId
Remove a job from user's saved jobs list.

### GET /jobs/saved
Get user's saved jobs with pagination.
Query params: page, limit

## Admin Endpoints (requires role='admin')

### POST /jobs
Create a new job. Supports inline company and category creation.
Body:
{
  "title": "Software Engineer",
  "location": "San Francisco, CA",
  "description": "## Job Description\n\nMarkdown supported...",
  "is_remote": true,
  "job_type": "FULL_TIME",
  "experience_level": "MID",
  "requirements": ["3+ years experience", "Node.js"],
  "responsibilities": ["Build features", "Code review"],
  "benefits": ["Health insurance", "401k"],
  "salary_min": 100000,
  "salary_max": 150000,
  "salary_currency": "USD",
  "skills": ["JavaScript", "Node.js", "React"],
  "application_deadline": "2026-03-01T00:00:00Z",

  // Option 1: Reference existing company
  "company_id": "uuid",

  // Option 2: Create new company inline
  "company": {
    "name": "Tech Corp",
    "industry": "Technology",
    "website": "https://techcorp.com",
    "location": "San Francisco"
  },

  // Option 1: Reference existing categories
  "category_ids": ["uuid1", "uuid2"],

  // Option 2: Create new categories inline
  "categories": [
    { "name": "Engineering", "description": "Software Engineering" },
    { "name": "Backend", "parent_id": "engineering-uuid" }
  ]
}

### POST /jobs/bulk
Create multiple jobs at once (max 100).
Body: { "jobs": [JobData, ...] }

### PUT /jobs/:id
Update an existing job.
Body: Same as POST /jobs, all fields optional

### DELETE /jobs/:id
Soft delete a job (sets is_active to false).

==========================================
*/
