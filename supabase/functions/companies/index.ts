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

interface CompanyFilters {
  page?: number;
  limit?: number;
  industry?: string;
  size?: string;
  location?: string;
  query?: string;
  includeInactive?: boolean;
}

interface CompanyData {
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  industry?: string;
  size?: string;
  location?: string;
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
    const serviceClient = createServiceClient();
    const { data: { user }, error } = await serviceClient.auth.admin
      .getUserById(userId);

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
 * Return unauthorized response
 */
function unauthorizedResponse(message = "Unauthorized") {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/**
 * Return forbidden response
 */
function forbiddenResponse(message = "Admin access required") {
  return new Response(JSON.stringify({ error: message }), {
    status: 403,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ==========================================
// MAIN REQUEST HANDLER
// ==========================================

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");

    // Verify authentication for all requests
    if (!authHeader) {
      return unauthorizedResponse("Authorization header required");
    }

    const userId = getUserIdFromToken(authHeader);
    if (!userId) {
      return unauthorizedResponse("Invalid or expired token");
    }

    // Create clients
    const userClient = createUserClient(authHeader);
    const serviceClient = createServiceClient();

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const companiesIndex = pathParts.findIndex((p) => p === "companies");
    const afterCompanies = companiesIndex >= 0
      ? pathParts.slice(companiesIndex + 1)
      : [];

    // Determine action and ID
    let action = "list";
    let companyId: string | null = null;

    if (afterCompanies.length > 0) {
      if (afterCompanies[0] === "bulk") {
        action = "bulk";
      } else {
        action = "single";
        companyId = afterCompanies[0];
      }
    }

    switch (req.method) {
      case "GET": {
        if (action === "single" && companyId) {
          // GET /companies/:id - Get single company (authenticated users)
          return await getCompanyById(userClient, companyId);
        } else {
          // GET /companies - Get all companies with filters (authenticated users)
          const filters = parseCompanyFilters(url.searchParams);
          return await getCompanies(userClient, filters);
        }
      }

      case "POST": {
        // Admin-only: Create company or bulk create
        const isAdmin = await isUserAdmin(authHeader, userId);
        if (!isAdmin) {
          return forbiddenResponse("Admin access required to create companies");
        }

        if (action === "bulk") {
          // POST /companies/bulk - Bulk create companies (admin)
          return await bulkCreateCompanies(serviceClient, req);
        } else {
          // POST /companies - Create new company (admin)
          return await createCompany(serviceClient, req);
        }
      }

      case "PUT": {
        if (!companyId) {
          return new Response(
            JSON.stringify({ error: "Company ID required for updates" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        // Admin-only: Update company
        const isAdmin = await isUserAdmin(authHeader, userId);
        if (!isAdmin) {
          return forbiddenResponse("Admin access required to update companies");
        }

        // PUT /companies/:id - Update company (admin)
        return await updateCompany(serviceClient, companyId, req);
      }

      case "DELETE": {
        // Admin-only: Delete company or bulk delete
        const isAdmin = await isUserAdmin(authHeader, userId);
        if (!isAdmin) {
          return forbiddenResponse("Admin access required to delete companies");
        }

        if (action === "bulk") {
          // DELETE /companies/bulk - Bulk delete companies (admin)
          return await bulkDeleteCompanies(serviceClient, req);
        } else if (companyId) {
          // DELETE /companies/:id - Soft delete company (admin)
          return await deleteCompany(serviceClient, companyId);
        } else {
          return new Response(
            JSON.stringify({ error: "Company ID required for deletion" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
      }

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
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
// FILTER PARSING
// ==========================================

function parseCompanyFilters(searchParams: URLSearchParams): CompanyFilters {
  return {
    page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
    limit: Math.min(
      searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10,
      100,
    ), // Max 100
    industry: searchParams.get("industry") || undefined,
    size: searchParams.get("size") || undefined,
    location: searchParams.get("location") || undefined,
    query: searchParams.get("query") || undefined,
    includeInactive: searchParams.get("includeInactive") === "true",
  };
}

// ==========================================
// GET ENDPOINTS
// ==========================================

async function getCompanies(supabaseClient: any, filters: CompanyFilters) {
  try {
    let query = supabaseClient
      .from("companies")
      .select("*", { count: "exact" })
      .order("name", { ascending: true });

    // Only show active companies by default
    if (!filters.includeInactive) {
      query = query.eq("is_active", true);
    }

    // Apply filters
    if (filters.industry) {
      query = query.ilike("industry", `%${filters.industry}%`);
    }

    if (filters.size) {
      query = query.eq("size", filters.size);
    }

    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    if (filters.query) {
      query = query.or(
        `name.ilike.%${filters.query}%,description.ilike.%${filters.query}%,industry.ilike.%${filters.query}%`,
      );
    }

    // Pagination
    const from = (filters.page! - 1) * filters.limit!;
    const to = from + filters.limit! - 1;
    query = query.range(from, to);

    const { data: companies, error, count } = await query;

    if (error) throw error;

    return new Response(
      JSON.stringify({
        companies,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          totalCount: count,
          totalPages: Math.ceil(count! / filters.limit!),
          hasNextPage: (filters.page! * filters.limit!) < count!,
          hasPrevPage: filters.page! > 1,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    throw error;
  }
}

async function getCompanyById(supabaseClient: any, companyId: string) {
  try {
    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(companyId)) {
      return new Response(
        JSON.stringify({ error: "Invalid company ID format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: company, error } = await supabaseClient
      .from("companies")
      .select(`
        *,
        jobs (
          id,
          title,
          location,
          job_type,
          experience_level,
          is_remote,
          posted_at,
          is_active
        )
      `)
      .eq("id", companyId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return new Response(JSON.stringify({ error: "Company not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw error;
    }

    // Filter to only show active jobs
    if (company.jobs) {
      company.jobs = company.jobs.filter((job: any) => job.is_active);
    }

    return new Response(JSON.stringify({ company }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    throw error;
  }
}

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

async function createCompany(supabaseClient: any, req: Request) {
  try {
    const companyData = await req.json();

    // Validate required fields
    if (
      !companyData.name || typeof companyData.name !== "string" ||
      companyData.name.trim().length === 0
    ) {
      return new Response(
        JSON.stringify({
          error: "Company name is required and must be a non-empty string",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check for duplicate company name
    const { data: existing } = await supabaseClient
      .from("companies")
      .select("id, name")
      .ilike("name", companyData.name.trim())
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({
          error: "A company with this name already exists",
          existing_company_id: existing[0].id,
        }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Sanitize input - only allow valid fields
    const sanitizedData: Partial<CompanyData> & { is_active: boolean } = {
      name: companyData.name.trim(),
      is_active: true, // New companies are active by default
    };

    if (companyData.description) {
      sanitizedData.description = companyData.description;
    }
    if (companyData.website) sanitizedData.website = companyData.website;
    if (companyData.logo_url) sanitizedData.logo_url = companyData.logo_url;
    if (companyData.industry) sanitizedData.industry = companyData.industry;
    if (companyData.size) sanitizedData.size = companyData.size;
    if (companyData.location) sanitizedData.location = companyData.location;

    const { data: company, error } = await supabaseClient
      .from("companies")
      .insert([sanitizedData])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ company }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    throw error;
  }
}

async function bulkCreateCompanies(supabaseClient: any, req: Request) {
  try {
    const { companies } = await req.json();

    if (!Array.isArray(companies) || companies.length === 0) {
      return new Response(
        JSON.stringify({
          error: "companies array is required and must not be empty",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (companies.length > 100) {
      return new Response(
        JSON.stringify({
          error: "Maximum 100 companies can be created at once",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate and sanitize all companies
    const sanitizedCompanies = [];
    const errors = [];

    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];

      if (
        !company.name || typeof company.name !== "string" ||
        company.name.trim().length === 0
      ) {
        errors.push({ index: i, error: "Company name is required" });
        continue;
      }

      const sanitizedData: Partial<CompanyData> & { is_active: boolean } = {
        name: company.name.trim(),
        is_active: true,
      };

      if (company.description) sanitizedData.description = company.description;
      if (company.website) sanitizedData.website = company.website;
      if (company.logo_url) sanitizedData.logo_url = company.logo_url;
      if (company.industry) sanitizedData.industry = company.industry;
      if (company.size) sanitizedData.size = company.size;
      if (company.location) sanitizedData.location = company.location;

      sanitizedCompanies.push(sanitizedData);
    }

    if (sanitizedCompanies.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No valid companies to create",
          validation_errors: errors,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: createdCompanies, error } = await supabaseClient
      .from("companies")
      .insert(sanitizedCompanies)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        message: `Created ${createdCompanies.length} companies`,
        companies: createdCompanies,
        validation_errors: errors.length > 0 ? errors : undefined,
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

async function updateCompany(
  supabaseClient: any,
  companyId: string,
  req: Request,
) {
  try {
    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(companyId)) {
      return new Response(
        JSON.stringify({ error: "Invalid company ID format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const updates = await req.json();

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.created_at;

    // Sanitize updates - only allow valid fields
    const sanitizedUpdates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) sanitizedUpdates.name = updates.name;
    if (updates.description !== undefined) {
      sanitizedUpdates.description = updates.description;
    }
    if (updates.website !== undefined) {
      sanitizedUpdates.website = updates.website;
    }
    if (updates.logo_url !== undefined) {
      sanitizedUpdates.logo_url = updates.logo_url;
    }
    if (updates.industry !== undefined) {
      sanitizedUpdates.industry = updates.industry;
    }
    if (updates.size !== undefined) sanitizedUpdates.size = updates.size;
    if (updates.location !== undefined) {
      sanitizedUpdates.location = updates.location;
    }
    if (updates.is_active !== undefined) {
      sanitizedUpdates.is_active = updates.is_active;
    }

    // If updating name, check for duplicates
    if (sanitizedUpdates.name) {
      const { data: existing } = await supabaseClient
        .from("companies")
        .select("id, name")
        .ilike("name", sanitizedUpdates.name.trim())
        .neq("id", companyId)
        .limit(1);

      if (existing && existing.length > 0) {
        return new Response(
          JSON.stringify({
            error: "A company with this name already exists",
            existing_company_id: existing[0].id,
          }),
          {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    const { data: company, error } = await supabaseClient
      .from("companies")
      .update(sanitizedUpdates)
      .eq("id", companyId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return new Response(JSON.stringify({ error: "Company not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw error;
    }

    return new Response(JSON.stringify({ company }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    throw error;
  }
}

async function deleteCompany(supabaseClient: any, companyId: string) {
  try {
    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(companyId)) {
      return new Response(
        JSON.stringify({ error: "Invalid company ID format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check if company has active jobs before allowing deletion
    const { data: activeJobsForCompany, error: activeJobsCheckError } =
      await supabaseClient
        .from("jobs")
        .select("id")
        .eq("company_id", companyId)
        .eq("is_active", true)
        .limit(1);

    if (activeJobsCheckError) throw activeJobsCheckError;

    if (activeJobsForCompany && activeJobsForCompany.length > 0) {
      return new Response(
        JSON.stringify({
          error:
            "Cannot delete company with active jobs. Please deactivate all jobs first.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Soft delete - set is_active to false
    const { data: company, error } = await supabaseClient
      .from("companies")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", companyId)
      .select("id, name")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return new Response(JSON.stringify({ error: "Company not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw error;
    }

    return new Response(
      JSON.stringify({
        message: "Company deleted successfully",
        company_id: company.id,
        company_name: company.name,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    throw error;
  }
}

async function bulkDeleteCompanies(supabaseClient: any, req: Request) {
  try {
    const { company_ids } = await req.json();

    if (!Array.isArray(company_ids) || company_ids.length === 0) {
      return new Response(
        JSON.stringify({
          error: "company_ids array is required and must not be empty",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (company_ids.length > 100) {
      return new Response(
        JSON.stringify({
          error: "Maximum 100 companies can be deleted at once",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate UUID format for all IDs
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const invalidIds = company_ids.filter((id) => !uuidRegex.test(id));

    if (invalidIds.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Invalid company ID format",
          invalid_ids: invalidIds,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check for companies with active jobs
    const { data: companiesWithJobs, error: jobsError } = await supabaseClient
      .from("jobs")
      .select("company_id")
      .in("company_id", company_ids)
      .eq("is_active", true);

    if (jobsError) throw jobsError;

    const companiesWithActiveJobs = [
      ...new Set(companiesWithJobs?.map((j: any) => j.company_id) || []),
    ];

    if (companiesWithActiveJobs.length > 0) {
      return new Response(
        JSON.stringify({
          error:
            "Some companies have active jobs. Please deactivate all jobs first.",
          companies_with_active_jobs: companiesWithActiveJobs,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Soft delete all companies
    const { data: deletedCompanies, error } = await supabaseClient
      .from("companies")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .in("id", company_ids)
      .select("id, name");

    if (error) throw error;

    return new Response(
      JSON.stringify({
        message: `Deleted ${deletedCompanies?.length || 0} companies`,
        deleted_companies: deletedCompanies,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    throw error;
  }
}

/*
==========================================
COMPANIES EDGE FUNCTION - API DOCUMENTATION
==========================================

Endpoints Overview:
-------------------
PUBLIC (Authenticated Users):
  GET  /companies          - List all companies with filters & pagination
  GET  /companies/:id      - Get single company with linked jobs

ADMIN ONLY:
  POST   /companies        - Create new company
  POST   /companies/bulk   - Bulk create companies (max 100)
  PUT    /companies/:id    - Update company
  DELETE /companies/:id    - Soft delete company
  DELETE /companies/bulk   - Bulk soft delete companies (max 100)

Query Parameters (GET /companies):
----------------------------------
  page            - Page number (default: 1)
  limit           - Results per page (default: 10, max: 100)
  industry        - Filter by industry (partial match)
  size            - Filter by company size (exact match)
  location        - Filter by location (partial match)
  query           - Full-text search in name, description, industry
  includeInactive - Include soft-deleted companies (admin use)

Example Requests:
-----------------

# List companies (authenticated user)
curl -i --location 'http://127.0.0.1:54321/functions/v1/companies?industry=tech&limit=10' \
  --header 'Authorization: Bearer <user_token>'

# Get single company
curl -i --location 'http://127.0.0.1:54321/functions/v1/companies/<company_id>' \
  --header 'Authorization: Bearer <user_token>'

# Create company (admin)
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/companies' \
  --header 'Authorization: Bearer <admin_token>' \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "Acme Corp",
    "description": "Leading tech company",
    "website": "https://acme.com",
    "industry": "Technology",
    "size": "100-500",
    "location": "San Francisco, CA"
  }'

# Bulk create companies (admin)
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/companies/bulk' \
  --header 'Authorization: Bearer <admin_token>' \
  --header 'Content-Type: application/json' \
  --data '{
    "companies": [
      { "name": "Company A", "industry": "Tech" },
      { "name": "Company B", "industry": "Finance" }
    ]
  }'

# Update company (admin)
curl -i --location --request PUT 'http://127.0.0.1:54321/functions/v1/companies/<company_id>' \
  --header 'Authorization: Bearer <admin_token>' \
  --header 'Content-Type: application/json' \
  --data '{ "description": "Updated description", "size": "500-1000" }'

# Delete company (admin) - soft delete
curl -i --location --request DELETE 'http://127.0.0.1:54321/functions/v1/companies/<company_id>' \
  --header 'Authorization: Bearer <admin_token>'

# Bulk delete companies (admin)
curl -i --location --request DELETE 'http://127.0.0.1:54321/functions/v1/companies/bulk' \
  --header 'Authorization: Bearer <admin_token>' \
  --header 'Content-Type: application/json' \
  --data '{ "company_ids": ["<id1>", "<id2>"] }'

*/
