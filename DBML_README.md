# ApplyMint AI Database Schema - DBML

This directory contains the complete database schema for ApplyMint AI in DBML (Database Markup Language) format.

## Files

- **`applymint-schema.dbml`** - Complete database schema definition
- **`complete-database-schema.sql`** - SQL version for direct database setup
- **`DATABASE_SCHEMA_DOCUMENTATION.md`** - Detailed documentation with ER diagrams

## What is DBML?

DBML (Database Markup Language) is a simple, readable language to define database schemas. It can be used to:

- Generate visual database diagrams
- Create documentation
- Maintain database schema as code
- Collaborate on database design

## Using DBML

### Online Tools

1. **DBML Viewer** - https://dbml.dbdiagram.io/
   - Copy and paste the DBML content
   - Get instant visual diagrams

2. **DBDiagram.io** - https://dbdiagram.io/
   - Import DBML files
   - Create interactive diagrams
   - Export to various formats

### CLI Tools

```bash
# Install DBML CLI
npm install -g @dbml/cli

# Generate SQL from DBML
dbml2sql applymint-schema.dbml --postgres

# Generate visual diagrams
dbml-renderer applymint-schema.dbml -o diagram.png
```

### VS Code Extensions

- **DBML** - Syntax highlighting and validation
- **Database Schema Visualizer** - Preview diagrams in VS Code

## Schema Overview

### Core Tables (16 total)

#### Authentication & Users
- `auth.users` - Supabase authentication
- `profiles` - Extended user profiles
- `user_preferences` - Job search preferences

#### Job Search
- `companies` - Company information
- `jobs` - Job listings
- `job_applications` - Application tracking
- `saved_jobs` - User bookmarks

#### Resume Management
- `resumes` - Main resume container
- `work_experiences` - Professional experience
- `educations` - Educational background
- `skills` - Technical/soft skills
- `certifications` - Professional credentials
- `projects` - Portfolio projects
- `languages` - Language proficiencies

#### AI Features & Analytics
- `interview_sessions` - AI interview prep
- `notifications` - System notifications
- `activity_logs` - User activity tracking

#### Categorization
- `job_categories` - Hierarchical categories
- `job_category_mappings` - Job-category relationships

## Key Relationships

```
auth.users (1) ──── (1) profiles (1) ──── (1) user_preferences
    │                       │
    │                       │
    ▼                       ▼
companies (1) ──── (many) jobs (1) ──── (many) job_applications
    │                       │                       │
    │                       │                       │
    ▼                       ▼                       ▼
job_categories ──── job_category_mappings ──── profiles
                                                │
                                                ▼
                                           resumes (1) ──── (many) work_experiences
                                                │                       │
                                                ▼                       ▼
                                           educations             certifications
                                                │                       │
                                                ▼                       ▼
                                           skills                 projects
                                                │                       │
                                                ▼                       ▼
                                           languages            interview_sessions
```

## Enums & Constraints

### Job Types
- FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE

### Experience Levels
- ENTRY, MID, SENIOR, EXECUTIVE

### Application Status
- DRAFT, SUBMITTED, UNDER_REVIEW, INTERVIEW, OFFER, REJECTED, ACCEPTED

### Skill Levels
- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

### And more...

## Performance Features

- **Indexes**: Optimized for common queries
- **RLS Policies**: Row-level security enabled
- **Triggers**: Auto-updating timestamps
- **Constraints**: Data integrity enforcement

## Getting Started

1. **View the Diagram**:
   - Go to https://dbml.dbdiagram.io/
   - Paste the content of `applymint-schema.dbml`
   - See the interactive visual diagram

2. **Generate SQL**:
   ```bash
   dbml2sql applymint-schema.dbml --postgres > schema.sql
   ```

3. **Setup Database**:
   - Run `complete-database-schema.sql` in Supabase SQL editor
   - Or use the DBML-generated SQL

## Contributing

When modifying the database schema:

1. Update the DBML file first
2. Generate new SQL and documentation
3. Test changes in development environment
4. Update migration scripts if needed

## Tools & Resources

- [DBML Official Site](https://www.dbml.org/)
- [DBML CLI](https://github.com/holistics/dbml)
- [DBDiagram.io](https://dbdiagram.io/)
- [Supabase Docs](https://supabase.com/docs)

---

**ApplyMint AI** - Database schema for AI-powered job search platform