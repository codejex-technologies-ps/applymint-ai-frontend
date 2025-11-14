import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { closeConnection, db } from "./connection";
import {
    certifications,
    companies,
    creditPackages,
    creditTransactions,
    educations,
    featureCreditCosts,
    interviewQuestions,
    interviewResponses,
    interviewSessions,
    jobAlerts,
    jobApplications,
    jobs,
    languages,
    notifications,
    profiles,
    projects,
    resumes,
    savedJobs,
    skills,
    userAnalytics,
    userPreferences,
    userSubscriptions,
    workExperiences,
} from "./schema";

dotenv.config();
const ids = {
    userJane: "11111111-1111-4111-8111-111111111111",
    userMarcus: "22222222-2222-4222-8222-222222222222",
    userPriya: "33333333-3333-4333-8333-333333333333",
    preferenceJane: "aaaa1111-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    preferenceMarcus: "bbbb2222-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    preferencePriya: "cccc3333-cccc-4ccc-8ccc-cccccccccccc",
    companyBrightByte: "d1a1f1c0-0001-4000-8000-000000000001",
    companyNimble: "d1a1f1c0-0001-4000-8000-000000000002",
    jobProductDesign: "f0a0b0c0-0001-4000-8000-000000000001",
    jobAiCoach: "f0a0b0c0-0001-4000-8000-000000000002",
    jobPlatformEngineer: "f0a0b0c0-0001-4000-8000-000000000003",
    resumeJane: "e1a1b1c1-0001-4000-8000-000000000001",
    resumeMarcus: "e1a1b1c1-0001-4000-8000-000000000002",
    resumePriya: "e1a1b1c1-0001-4000-8000-000000000003",
    workExpJane1: "fe111111-1111-4111-8111-111111111111",
    workExpJane2: "fe111111-1111-4111-8111-111111111112",
    workExpMarcus1: "fe222222-2222-4222-8222-222222222221",
    workExpPriya1: "fe333333-3333-4333-8333-333333333331",
    educationJane: "ed111111-1111-4111-8111-111111111111",
    educationMarcus: "ed222222-2222-4222-8222-222222222222",
    educationPriya: "ed333333-3333-4333-8333-333333333333",
    skillJane1: "sk111111-1111-4111-8111-111111111111",
    skillJane2: "sk111111-1111-4111-8111-111111111112",
    skillMarcus1: "sk222222-2222-4222-8222-222222222221",
    skillPriya1: "sk333333-3333-4333-8333-333333333331",
    certificationJane: "ce111111-1111-4111-8111-111111111111",
    certificationMarcus: "ce222222-2222-4222-8222-222222222222",
    projectJane: "pr111111-1111-4111-8111-111111111111",
    projectMarcus: "pr222222-2222-4222-8222-222222222222",
    projectPriya: "pr333333-3333-4333-8333-333333333333",
    languageJane: "la111111-1111-4111-8111-111111111111",
    languageMarcus: "la222222-2222-4222-8222-222222222222",
    languagePriya: "la333333-3333-4333-8333-333333333333",
    jobApplicationJane: "ja111111-1111-4111-8111-111111111111",
    jobApplicationMarcus: "ja222222-2222-4222-8222-222222222222",
    savedJobPriya: "sj333333-3333-4333-8333-333333333333",
    jobAlertJane: "al111111-1111-4111-8111-111111111111",
    jobAlertMarcus: "al222222-2222-4222-8222-222222222222",
    interviewSessionJane: "is111111-1111-4111-8111-111111111111",
    interviewSessionMarcus: "is222222-2222-4222-8222-222222222222",
    interviewQuestionJane1: "iq111111-1111-4111-8111-111111111111",
    interviewQuestionJane2: "iq111111-1111-4111-8111-111111111112",
    interviewQuestionMarcus1: "iq222222-2222-4222-8222-222222222221",
    interviewResponseJane1: "ir111111-1111-4111-8111-111111111111",
    interviewResponseJane2: "ir111111-1111-4111-8111-111111111112",
    interviewResponseMarcus1: "ir222222-2222-4222-8222-222222222221",
    notificationJane1: "nt111111-1111-4111-8111-111111111111",
    notificationMarcus1: "nt222222-2222-4222-8222-222222222222",
    notificationPriya1: "nt333333-3333-4333-8333-333333333333",
    userAnalyticsJane: "ua111111-1111-4111-8111-111111111111",
    userAnalyticsMarcus: "ua222222-2222-4222-8222-222222222222",
    userAnalyticsPriya: "ua333333-3333-4333-8333-333333333333",
    creditPackageStarterPlus: "cp111111-1111-4111-8111-111111111111",
    creditPackageCareerMonthly: "cp222222-2222-4222-8222-222222222222",
    creditTransactionJanePurchase: "ct111111-1111-4111-8111-111111111111",
    creditTransactionJaneResume: "ct111111-1111-4111-8111-111111111112",
    creditTransactionJaneInterview: "ct111111-1111-4111-8111-111111111113",
    creditTransactionJaneMatch: "ct111111-1111-4111-8111-111111111114",
    creditTransactionMarcusPurchase: "ct222222-2222-4222-8222-222222222221",
    creditTransactionMarcusResume: "ct222222-2222-4222-8222-222222222222",
    creditTransactionMarcusInterview: "ct222222-2222-4222-8222-222222222223",
    creditTransactionPriyaBonus: "ct333333-3333-4333-8333-333333333331",
    creditTransactionPriyaResume: "ct333333-3333-4333-8333-333333333332",
    creditTransactionPriyaMatch: "ct333333-3333-4333-8333-333333333333",
    userSubscriptionMarcus: "us222222-2222-4222-8222-222222222222",
};

const userSeeds = [
    {
        id: ids.userJane,
        email: "jane.doe@example.com",
        password: "Password123!",
        firstName: "Jane",
        lastName: "Doe",
        phoneNumber: "+1-415-555-0101",
        bio: "Product designer focused on AI-assisted workflows and inclusive design systems.",
        location: "San Francisco, CA",
        website: "https://janedoe.design",
        linkedinUrl: "https://www.linkedin.com/in/janedoe",
        githubUrl: "https://github.com/janedoe",
        twitterUrl: "https://x.com/jane_doe",
        portfolioUrl: "https://portfolio.janedoe.design",
        currentPosition: "Senior Product Designer",
        company: "BrightByte Labs",
        yearsOfExperience: 8,
        availabilityStatus: "open_to_opportunities" as const,
        preferredWorkType: "full_time" as const,
        profileVisibility: "public" as const,
        credit: 39,
    },
    {
        id: ids.userMarcus,
        email: "marcus.lee@example.com",
        password: "Password123!",
        firstName: "Marcus",
        lastName: "Lee",
        phoneNumber: "+1-646-555-0145",
        bio: "Full-stack engineer shipping resilient products with TypeScript, React, and Node.js.",
        location: "New York, NY",
        website: "https://marcus.dev",
        linkedinUrl: "https://www.linkedin.com/in/marcus-lee",
        githubUrl: "https://github.com/mlee-dev",
        twitterUrl: "https://x.com/mlee_dev",
        portfolioUrl: "https://projects.marcus.dev",
        currentPosition: "Staff Software Engineer",
        company: "NimblePath",
        yearsOfExperience: 10,
        availabilityStatus: "available" as const,
        preferredWorkType: "contract" as const,
        profileVisibility: "public" as const,
        credit: 30,
    },
    {
        id: ids.userPriya,
        email: "priya.patel@example.com",
        password: "Password123!",
        firstName: "Priya",
        lastName: "Patel",
        phoneNumber: "+91-22-5550-1212",
        bio: "AI career coach helping candidates land interviews with data-backed strategies.",
        location: "Mumbai, India",
        website: "https://pcoach.ai",
        linkedinUrl: "https://www.linkedin.com/in/priyapatel",
        githubUrl: "https://github.com/priyapatel-ai",
        twitterUrl: "https://x.com/priyapatel_ai",
        portfolioUrl: "https://coach.priyapatel.ai",
        currentPosition: "AI Career Coach",
        company: "CareerLift",
        yearsOfExperience: 6,
        availabilityStatus: "open_to_opportunities" as const,
        preferredWorkType: "freelance" as const,
        profileVisibility: "connections_only" as const,
        credit: 12,
    },
];

const preferenceSeeds = [
    {
        id: ids.preferenceJane,
        userId: ids.userJane,
        jobAlerts: true,
        emailNotifications: true,
        smsNotifications: false,
        preferredJobTypes: ["FULL_TIME", "CONTRACT"],
        preferredLocations: ["San Francisco, CA", "Remote"],
        salaryMin: "120000",
        salaryMax: "160000",
        salaryCurrency: "USD",
        remoteWork: true,
    },
    {
        id: ids.preferenceMarcus,
        userId: ids.userMarcus,
        jobAlerts: true,
        emailNotifications: true,
        smsNotifications: true,
        preferredJobTypes: ["CONTRACT", "FULL_TIME"],
        preferredLocations: ["New York, NY", "Remote"],
        salaryMin: "140000",
        salaryMax: "200000",
        salaryCurrency: "USD",
        remoteWork: true,
    },
    {
        id: ids.preferencePriya,
        userId: ids.userPriya,
        jobAlerts: true,
        emailNotifications: true,
        smsNotifications: false,
        preferredJobTypes: ["FREELANCE"],
        preferredLocations: ["Remote"],
        salaryMin: "60000",
        salaryMax: "90000",
        salaryCurrency: "USD",
        remoteWork: true,
    },
];

const companySeeds = [
    {
        id: ids.companyBrightByte,
        name: "BrightByte Labs",
        description:
            "Design-first SaaS company creating AI copilots for product teams.",
        website: "https://brightbytelabs.com",
        logoUrl: "https://assets.applymint.ai/logos/brightbyte.svg",
        industry: "SaaS",
        size: "MEDIUM" as const,
        location: "San Francisco, CA",
    },
    {
        id: ids.companyNimble,
        name: "NimblePath",
        description:
            "Hybrid workforce platform powering distributed engineering organizations.",
        website: "https://nimblepath.io",
        logoUrl: "https://assets.applymint.ai/logos/nimblepath.svg",
        industry: "Technology",
        size: "LARGE" as const,
        location: "New York, NY",
    },
];

const jobSeeds = [
    {
        id: ids.jobProductDesign,
        title: "Senior Product Designer, AI Workflows",
        companyId: ids.companyBrightByte,
        location: "San Francisco, CA",
        isRemote: true,
        jobType: "FULL_TIME" as const,
        experienceLevel: "SENIOR" as const,
        description:
            "Own the end-to-end product experience for BrightByte's AI assistant.",
        requirements: [
            "8+ years of product design experience",
            "Portfolio demonstrating shipped SaaS products",
            "Experience designing with AI/ML teams",
        ],
        responsibilities: [
            "Lead discovery workshops with enterprise customers",
            "Prototype AI-assisted experiences that increase user productivity",
            "Partner with data science to translate insights into product improvements",
        ],
        benefits: [
            "Distributed team stipend",
            "Company equity",
            "Monthly wellness budget",
        ],
        salaryMin: "140000",
        salaryMax: "180000",
        salaryCurrency: "USD",
        skills: ["Design Systems", "UX Research", "Figma", "AI Collaboration"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        isActive: true,
        externalJobId: "BB-1011",
        externalSource: "GREENHOUSE",
    },
    {
        id: ids.jobAiCoach,
        title: "AI Job Coach (US Market)",
        companyId: ids.companyBrightByte,
        location: "Remote (US)",
        isRemote: true,
        jobType: "CONTRACT" as const,
        experienceLevel: "MID" as const,
        description:
            "Coach job seekers with AI-personalized playbooks and interview prep.",
        requirements: [
            "Experience in career coaching or recruiting",
            "Comfortable using AI tools to generate insights",
            "Excellent written communication",
        ],
        responsibilities: [
            "Run 1:1 coaching sessions with ApplyMint members",
            "Tailor resume and outreach strategies",
            "Provide interview practice with AI scoring feedback",
        ],
        benefits: [
            "Remote-first culture",
            "Performance bonuses",
            "Weekly learning sessions",
        ],
        salaryMin: "70000",
        salaryMax: "90000",
        salaryCurrency: "USD",
        skills: ["Career Coaching", "AI Tools", "Communication"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
        applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
        isActive: true,
        externalJobId: "BB-2042",
        externalSource: "APPLYMINT",
    },
    {
        id: ids.jobPlatformEngineer,
        title: "Platform Engineer, Hiring Intelligence",
        companyId: ids.companyNimble,
        location: "New York, NY",
        isRemote: false,
        jobType: "FULL_TIME" as const,
        experienceLevel: "SENIOR" as const,
        description:
            "Build the infrastructure powering the next generation of talent intelligence.",
        requirements: [
            "10+ years software engineering experience",
            "Proficient with TypeScript, Node.js, and Postgres",
            "Experience scaling event-driven architectures",
        ],
        responsibilities: [
            "Design resilient data pipelines for hiring signals",
            "Ship developer tooling that accelerates product teams",
            "Collaborate with product to define platform roadmap",
        ],
        benefits: [
            "401(k) with match",
            "Hybrid work stipend",
            "Global retreat twice a year",
        ],
        salaryMin: "170000",
        salaryMax: "210000",
        salaryCurrency: "USD",
        skills: ["TypeScript", "PostgreSQL", "Event Sourcing", "AWS"],
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
        applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40),
        isActive: true,
        externalJobId: "NP-8801",
        externalSource: "LEVER",
    },
];

const resumeSeeds = [
    {
        id: ids.resumeJane,
        userId: ids.userJane,
        title: "Jane Doe – Product Designer Resume",
        summary:
            "Design leader crafting intelligent, human-centred experiences that convert.",
        isDefault: true,
        fileName: "jane-doe-resume.pdf",
        fileUrl: "https://assets.applymint.ai/resumes/jane-doe.pdf",
        fileSize: "1.2MB",
    },
    {
        id: ids.resumeMarcus,
        userId: ids.userMarcus,
        title: "Marcus Lee – Staff Engineer Resume",
        summary:
            "Infrastructure-focused engineer scaling AI products to millions of users.",
        isDefault: true,
        fileName: "marcus-lee-resume.pdf",
        fileUrl: "https://assets.applymint.ai/resumes/marcus-lee.pdf",
        fileSize: "1.5MB",
    },
    {
        id: ids.resumePriya,
        userId: ids.userPriya,
        title: "Priya Patel – AI Career Coach Resume",
        summary:
            "Coaching 500+ candidates with data-backed playbooks and AI interview prep.",
        isDefault: true,
        fileName: "priya-patel-resume.pdf",
        fileUrl: "https://assets.applymint.ai/resumes/priya-patel.pdf",
        fileSize: "1.1MB",
    },
];

const workExperienceSeeds = [
    {
        id: ids.workExpJane1,
        resumeId: ids.resumeJane,
        company: "BrightByte Labs",
        position: "Senior Product Designer",
        location: "San Francisco, CA",
        startDate: "2021-04-01",
        endDate: null,
        isCurrent: true,
        description:
            "Owning AI-assisted hiring experiences across BrightByte platform.",
        achievements: [
            "Shipped AI onboarding assistant increasing activation by 35%",
        ],
        skills: ["Product Strategy", "Design Systems", "AI Workflows"],
    },
    {
        id: ids.workExpJane2,
        resumeId: ids.resumeJane,
        company: "Nimbus Analytics",
        position: "Product Designer",
        location: "New York, NY",
        startDate: "2017-08-01",
        endDate: "2021-03-01",
        isCurrent: false,
        description: "Designed B2B analytics workflows across web and mobile.",
        achievements: ["Grew self-serve onboarding conversion by 22%"],
        skills: ["User Research", "Interaction Design"],
    },
    {
        id: ids.workExpMarcus1,
        resumeId: ids.resumeMarcus,
        company: "NimblePath",
        position: "Staff Software Engineer",
        location: "New York, NY",
        startDate: "2019-02-01",
        endDate: null,
        isCurrent: true,
        description:
            "Owning platform reliability and DX initiatives across 40 squads.",
        achievements: [
            "Reduced cold-start latency by 45% via edge caching strategy",
            "Led TypeScript migration for 120+ services",
        ],
        skills: ["TypeScript", "PostgreSQL", "AWS"],
    },
    {
        id: ids.workExpPriya1,
        resumeId: ids.resumePriya,
        company: "CareerLift",
        position: "AI Career Coach",
        location: "Remote",
        startDate: "2020-01-01",
        endDate: null,
        isCurrent: true,
        description:
            "Designing AI-powered job search playbooks and mock interviews.",
        achievements: ["Helped 180+ candidates secure senior roles in 2024"],
        skills: ["Coaching", "Prompt Engineering", "Interview Prep"],
    },
];

const educationSeeds = [
    {
        id: ids.educationJane,
        resumeId: ids.resumeJane,
        institution: "Parsons School of Design",
        degree: "BACHELOR" as const,
        fieldOfStudy: "Communication Design",
        startDate: "2010-09-01",
        endDate: "2014-05-01",
        gpa: "3.7/4.0",
        description: "Focused on interaction design and emerging interfaces.",
        achievements: ["UX Design Lab Fellow"],
    },
    {
        id: ids.educationMarcus,
        resumeId: ids.resumeMarcus,
        institution: "Carnegie Mellon University",
        degree: "MASTER" as const,
        fieldOfStudy: "Software Engineering",
        startDate: "2012-09-01",
        endDate: "2014-05-01",
        gpa: "3.8/4.0",
        description:
            "Graduate research on distributed systems and developer tooling.",
        achievements: ["Teaching Assistant for Advanced Distributed Systems"],
    },
    {
        id: ids.educationPriya,
        resumeId: ids.resumePriya,
        institution: "Indian Institute of Technology Bombay",
        degree: "BACHELOR" as const,
        fieldOfStudy: "Information Technology",
        startDate: "2011-07-01",
        endDate: "2015-05-01",
        gpa: "8.4/10",
        description: "Led career development club and peer mentoring programs.",
        achievements: ["Innovation in Career Services award"],
    },
];

const skillSeeds = [
    {
        id: ids.skillJane1,
        resumeId: ids.resumeJane,
        name: "Figma",
        level: "EXPERT" as const,
        category: "TOOLS" as const,
        yearsOfExperience: "6 years",
        description: "Design system foundations and component libraries.",
    },
    {
        id: ids.skillJane2,
        resumeId: ids.resumeJane,
        name: "AI Design",
        level: "ADVANCED" as const,
        category: "PROGRAMMING" as const,
        yearsOfExperience: "3 years",
        description: "Integrating AI copilots into core workflows.",
    },
    {
        id: ids.skillMarcus1,
        resumeId: ids.resumeMarcus,
        name: "TypeScript",
        level: "EXPERT" as const,
        category: "PROGRAMMING" as const,
        yearsOfExperience: "7 years",
        description: "Led TypeScript architecture across large-scale systems.",
    },
    {
        id: ids.skillPriya1,
        resumeId: ids.resumePriya,
        name: "Interview Coaching",
        level: "EXPERT" as const,
        category: "SOFT_SKILLS" as const,
        yearsOfExperience: "5 years",
        description: "Specialised in behavioural and system design prep.",
    },
];

const certificationSeeds = [
    {
        id: ids.certificationJane,
        resumeId: ids.resumeJane,
        name: "NN/g UX Certification",
        issuer: "Nielsen Norman Group",
        issueDate: "2022-06-01",
        expiryDate: null,
        credentialId: "UX-99812",
        credentialUrl: "https://nngroup.com/certifications/ux-99812",
    },
    {
        id: ids.certificationMarcus,
        resumeId: ids.resumeMarcus,
        name: "AWS Certified Solutions Architect – Professional",
        issuer: "Amazon Web Services",
        issueDate: "2023-03-01",
        expiryDate: "2026-03-01",
        credentialId: "AWS-PSA-55123",
        credentialUrl: "https://aws.amazon.com/verification/aws-psa-55123",
    },
];

const projectSeeds = [
    {
        id: ids.projectJane,
        resumeId: ids.resumeJane,
        title: "Guided AI Critique Tool",
        description:
            "Built an AI-powered design critique assistant adopted by 30+ product teams.",
        technologies: ["Next.js", "OpenAI", "Tailwind"],
        projectUrl: "https://brightbytelabs.com/ai-critique",
        githubUrl: "https://github.com/janedoe/ai-critique-tool",
        startDate: "2023-01-01",
        endDate: "2023-08-01",
    },
    {
        id: ids.projectMarcus,
        resumeId: ids.resumeMarcus,
        title: "Talent Graph Platform",
        description:
            "Scaled event-driven talent intelligence graph processing 12M events/day.",
        technologies: ["TypeScript", "Kafka", "PostgreSQL"],
        projectUrl: "https://nimblepath.io/talent-graph",
        githubUrl: null,
        startDate: "2022-04-01",
        endDate: "2023-12-01",
    },
    {
        id: ids.projectPriya,
        resumeId: ids.resumePriya,
        title: "AI Interview Coach Toolkit",
        description:
            "Automated mock interview feedback with sentiment tracking and analytics.",
        technologies: ["Python", "LangChain", "Supabase"],
        projectUrl: "https://careerlift.ai/interview-toolkit",
        githubUrl: "https://github.com/priyapatel-ai/interview-toolkit",
        startDate: "2021-05-01",
        endDate: "2022-02-01",
    },
];

const languageSeeds = [
    {
        id: ids.languageJane,
        resumeId: ids.resumeJane,
        name: "English",
        proficiency: "NATIVE" as const,
    },
    {
        id: ids.languageMarcus,
        resumeId: ids.resumeMarcus,
        name: "English",
        proficiency: "NATIVE" as const,
    },
    {
        id: ids.languagePriya,
        resumeId: ids.resumePriya,
        name: "Hindi",
        proficiency: "NATIVE" as const,
    },
];

const jobApplicationSeeds = [
    {
        id: ids.jobApplicationJane,
        jobId: ids.jobProductDesign,
        userId: ids.userJane,
        resumeId: ids.resumeJane,
        coverLetter:
            "I have spent eight years designing AI-first workflows and would love to elevate BrightByte's assistant.",
        status: "INTERVIEW" as const,
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        notes: "Scheduled portfolio walkthrough; strong culture fit.",
    },
    {
        id: ids.jobApplicationMarcus,
        jobId: ids.jobPlatformEngineer,
        userId: ids.userMarcus,
        resumeId: ids.resumeMarcus,
        coverLetter:
            "Excited to help NimblePath scale platform reliability with pragmatic tooling.",
        status: "UNDER_REVIEW" as const,
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
        notes:
            "Referral from VP Engineering. Requested system design challenge.",
    },
];

const savedJobSeeds = [
    {
        id: ids.savedJobPriya,
        jobId: ids.jobProductDesign,
        userId: ids.userPriya,
        savedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        notes:
            "Use as reference for coaching clients moving into product design.",
    },
];

const jobAlertSeeds = [
    {
        id: ids.jobAlertJane,
        userId: ids.userJane,
        name: "Remote Design Leadership Roles",
        keywords: ["design systems", "lead", "ai"],
        location: "Remote",
        jobTypes: ["FULL_TIME"],
        salaryMin: "130000",
        salaryMax: "200000",
        isRemote: true,
        frequency: "DAILY" as const,
        isActive: true,
        lastSent: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
    {
        id: ids.jobAlertMarcus,
        userId: ids.userMarcus,
        name: "Platform & Infrastructure Contracts",
        keywords: ["platform engineer", "typescript", "aws"],
        location: "Remote",
        jobTypes: ["CONTRACT"],
        salaryMin: "150000",
        salaryMax: "220000",
        isRemote: true,
        frequency: "WEEKLY" as const,
        isActive: true,
        lastSent: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
];

const interviewSessionSeeds = [
    {
        id: ids.interviewSessionJane,
        userId: ids.userJane,
        title: "BrightByte Portfolio Conversation",
        type: "MOCK_INTERVIEW" as const,
        status: "COMPLETED" as const,
        duration: 45,
        score: 82,
        feedback:
            "Strong storytelling. Iterate on metrics clarity for final round.",
        metadata: JSON.stringify({
            jobId: ids.jobProductDesign,
            focus: "portfolio",
        }),
    },
    {
        id: ids.interviewSessionMarcus,
        userId: ids.userMarcus,
        title: "System Design Warmup",
        type: "PRACTICE" as const,
        status: "ACTIVE" as const,
        duration: 60,
        score: null,
        feedback: null,
        metadata: JSON.stringify({
            topic: "event-driven systems",
            template: "hiring-intelligence",
        }),
    },
];

const interviewQuestionSeeds = [
    {
        id: ids.interviewQuestionJane1,
        sessionId: ids.interviewSessionJane,
        question:
            "Walk me through a time you used AI to improve a core workflow.",
        type: "BEHAVIORAL" as const,
        difficulty: "MEDIUM" as const,
        expectedAnswer:
            "Highlight problem discovery, AI collaboration, and measurable outcome.",
        timeLimit: 180,
        order: 1,
    },
    {
        id: ids.interviewQuestionJane2,
        sessionId: ids.interviewSessionJane,
        question:
            "How do you validate AI suggestions with end-users before production?",
        type: "GENERAL" as const,
        difficulty: "MEDIUM" as const,
        expectedAnswer:
            "Discuss prototyping, user testing loops, and guardrails.",
        timeLimit: 150,
        order: 2,
    },
    {
        id: ids.interviewQuestionMarcus1,
        sessionId: ids.interviewSessionMarcus,
        question:
            "Design a fault-tolerant event pipeline for resume ingestion.",
        type: "TECHNICAL" as const,
        difficulty: "HARD" as const,
        expectedAnswer:
            "Cover partitioning strategy, retries, DLQs, and observability.",
        timeLimit: 900,
        order: 1,
    },
];

const interviewResponseSeeds = [
    {
        id: ids.interviewResponseJane1,
        questionId: ids.interviewQuestionJane1,
        response:
            "Collaborated with data science to embed summarisation that cut report prep time by 40%.",
        responseTime: 165,
        score: 78,
        feedback: "Great structure. Add more detail on stakeholder alignment.",
        audioUrl: null,
    },
    {
        id: ids.interviewResponseJane2,
        questionId: ids.interviewQuestionJane2,
        response:
            "Used Wizard of Oz testing to validate adoption before engineering investment.",
        responseTime: 132,
        score: 85,
        feedback: "Nice emphasis on risk mitigation.",
        audioUrl: null,
    },
    {
        id: ids.interviewResponseMarcus1,
        questionId: ids.interviewQuestionMarcus1,
        response:
            "Outlined Kafka with per-tenant topics, consumer groups per team, and DLQs monitored via Grafana.",
        responseTime: 780,
        score: 0,
        feedback: null,
        audioUrl: null,
    },
];

const notificationSeeds = [
    {
        id: ids.notificationJane1,
        userId: ids.userJane,
        type: "INTERVIEW_REMINDER" as const,
        title: "Portfolio conversation confirmed",
        message:
            "BrightByte scheduled a portfolio deep-dive for Tuesday at 10:00 AM PT.",
        isRead: false,
        actionUrl: "https://app.applymint.ai/dashboard/interviews",
        metadata: JSON.stringify({
            jobId: ids.jobProductDesign,
            interviewDate: "2025-02-04T18:00:00Z",
        }),
    },
    {
        id: ids.notificationMarcus1,
        userId: ids.userMarcus,
        type: "JOB_MATCH" as const,
        title: "New platform engineer contract available",
        message:
            "Synapse Systems is looking for a 6-month TypeScript contractor.",
        isRead: true,
        actionUrl:
            "https://app.applymint.ai/jobs/f0a0b0c0-0001-4000-8000-000000000003",
        metadata: JSON.stringify({ matchScore: 88 }),
    },
    {
        id: ids.notificationPriya1,
        userId: ids.userPriya,
        type: "SYSTEM" as const,
        title: "You earned bonus credits",
        message:
            "Thanks for hosting 25 mock interviews! We added a 10-credit bonus.",
        isRead: false,
        actionUrl: "https://app.applymint.ai/credits",
        metadata: JSON.stringify({ bonusCredits: 10 }),
    },
];

const userAnalyticsSeeds = [
    {
        id: ids.userAnalyticsJane,
        userId: ids.userJane,
        eventType: "INTERVIEW_PRACTICE" as const,
        eventData: JSON.stringify({ sessionId: ids.interviewSessionJane }),
        sessionId: "sess-jane-001",
        ipAddress: "192.168.1.12",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4)",
        referrer: "https://app.applymint.ai/dashboard",
        pageUrl: "https://app.applymint.ai/interviews/mock",
        date: "2025-02-01",
    },
    {
        id: ids.userAnalyticsMarcus,
        userId: ids.userMarcus,
        eventType: "JOB_VIEW" as const,
        eventData: JSON.stringify({ jobId: ids.jobPlatformEngineer }),
        sessionId: "sess-marcus-210",
        ipAddress: "10.0.0.55",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        referrer: "https://newsletter.applymint.ai",
        pageUrl:
            "https://app.applymint.ai/jobs/f0a0b0c0-0001-4000-8000-000000000003",
        date: "2025-01-28",
    },
    {
        id: ids.userAnalyticsPriya,
        userId: ids.userPriya,
        eventType: "SEARCH_PERFORMED" as const,
        eventData: JSON.stringify({ query: "remote ai career coach" }),
        sessionId: "sess-priya-077",
        ipAddress: "203.192.16.45",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
        referrer: "https://app.applymint.ai/dashboard",
        pageUrl: "https://app.applymint.ai/jobs",
        date: "2025-02-02",
    },
];

const creditPackageSeeds = [
    {
        id: ids.creditPackageStarterPlus,
        name: "Starter Plus Pack",
        description: "Boost your credits for upcoming interview season.",
        credits: 40,
        price: "19.99",
        currency: "USD",
        packageType: "one_time" as const,
        billingInterval: null,
        stripePriceId: "price_starter_plus",
        isActive: true,
        sortOrder: 5,
    },
    {
        id: ids.creditPackageCareerMonthly,
        name: "Career Accelerator Monthly",
        description: "Monthly bundle with bonus interview scheduling credits.",
        credits: 35,
        price: "29.99",
        currency: "USD",
        packageType: "subscription" as const,
        billingInterval: "monthly" as const,
        stripePriceId: "price_career_accelerator_monthly",
        isActive: true,
        sortOrder: 6,
    },
];

const featureCreditCostSeeds = [
    {
        featureType: "resume_optimization" as const,
        featureName: "Resume Optimization",
        creditCost: 2,
        description: "Tailor your resume to any job in seconds.",
        isActive: true,
    },
    {
        featureType: "interview_scheduling" as const,
        featureName: "Interview Scheduling",
        creditCost: 3,
        description: "AI-powered scheduling with interviewer matching.",
        isActive: true,
    },
    {
        featureType: "ai_matching" as const,
        featureName: "AI Job Matching",
        creditCost: 1,
        description: "Daily AI-curated matches tuned to your profile.",
        isActive: true,
    },
];

const creditTransactionSeeds = [
    {
        id: ids.creditTransactionJanePurchase,
        userId: ids.userJane,
        transactionType: "purchase" as const,
        amount: 40,
        balanceBefore: 5,
        balanceAfter: 45,
        creditPackageId: ids.creditPackageStarterPlus,
        stripePaymentIntentId: "pi_jane_001",
        price: "19.99",
        featureType: null,
        featureId: null,
        description: "Purchased Starter Plus Pack",
        metadata: JSON.stringify({ source: "seed", paymentMethod: "card" }),
    },
    {
        id: ids.creditTransactionJaneResume,
        userId: ids.userJane,
        transactionType: "usage" as const,
        amount: -2,
        balanceBefore: 45,
        balanceAfter: 43,
        creditPackageId: null,
        stripePaymentIntentId: null,
        price: null,
        featureType: "resume_optimization" as const,
        featureId: ids.jobProductDesign,
        description: "Optimised resume for BrightByte application",
        metadata: JSON.stringify({ jobId: ids.jobProductDesign }),
    },
    {
        id: ids.creditTransactionJaneInterview,
        userId: ids.userJane,
        transactionType: "usage" as const,
        amount: -3,
        balanceBefore: 43,
        balanceAfter: 40,
        creditPackageId: null,
        stripePaymentIntentId: null,
        price: null,
        featureType: "interview_scheduling" as const,
        featureId: ids.interviewSessionJane,
        description: "Scheduled portfolio conversation practice",
        metadata: JSON.stringify({ sessionId: ids.interviewSessionJane }),
    },
    {
        id: ids.creditTransactionJaneMatch,
        userId: ids.userJane,
        transactionType: "usage" as const,
        amount: -1,
        balanceBefore: 40,
        balanceAfter: 39,
        creditPackageId: null,
        stripePaymentIntentId: null,
        price: null,
        featureType: "ai_matching" as const,
        featureId: ids.jobProductDesign,
        description: "Requested extended AI job matching insights",
        metadata: JSON.stringify({ matchScore: 92 }),
    },
    {
        id: ids.creditTransactionMarcusPurchase,
        userId: ids.userMarcus,
        transactionType: "purchase" as const,
        amount: 30,
        balanceBefore: 5,
        balanceAfter: 35,
        creditPackageId: ids.creditPackageCareerMonthly,
        stripePaymentIntentId: "pi_marcus_001",
        price: "29.99",
        featureType: null,
        featureId: null,
        description: "Subscribed to Career Accelerator Monthly",
        metadata: JSON.stringify({
            source: "seed",
            plan: "career-accelerator",
        }),
    },
    {
        id: ids.creditTransactionMarcusResume,
        userId: ids.userMarcus,
        transactionType: "usage" as const,
        amount: -2,
        balanceBefore: 35,
        balanceAfter: 33,
        creditPackageId: null,
        stripePaymentIntentId: null,
        price: null,
        featureType: "resume_optimization" as const,
        featureId: ids.jobPlatformEngineer,
        description: "Optimised resume for platform engineer role",
        metadata: JSON.stringify({ jobId: ids.jobPlatformEngineer }),
    },
    {
        id: ids.creditTransactionMarcusInterview,
        userId: ids.userMarcus,
        transactionType: "usage" as const,
        amount: -3,
        balanceBefore: 33,
        balanceAfter: 30,
        creditPackageId: null,
        stripePaymentIntentId: null,
        price: null,
        featureType: "interview_scheduling" as const,
        featureId: ids.interviewSessionMarcus,
        description: "Scheduled system design rehearsal",
        metadata: JSON.stringify({ sessionId: ids.interviewSessionMarcus }),
    },
    {
        id: ids.creditTransactionPriyaBonus,
        userId: ids.userPriya,
        transactionType: "bonus" as const,
        amount: 10,
        balanceBefore: 5,
        balanceAfter: 15,
        creditPackageId: null,
        stripePaymentIntentId: null,
        price: null,
        featureType: null,
        featureId: null,
        description: "Referral bonus for coaching new applicants",
        metadata: JSON.stringify({ reason: "referral_program" }),
    },
    {
        id: ids.creditTransactionPriyaResume,
        userId: ids.userPriya,
        transactionType: "usage" as const,
        amount: -2,
        balanceBefore: 15,
        balanceAfter: 13,
        creditPackageId: null,
        stripePaymentIntentId: null,
        price: null,
        featureType: "resume_optimization" as const,
        featureId: ids.jobAiCoach,
        description: "Prepared resume for AI coaching marketplace listing",
        metadata: JSON.stringify({ jobId: ids.jobAiCoach }),
    },
    {
        id: ids.creditTransactionPriyaMatch,
        userId: ids.userPriya,
        transactionType: "usage" as const,
        amount: -1,
        balanceBefore: 13,
        balanceAfter: 12,
        creditPackageId: null,
        stripePaymentIntentId: null,
        price: null,
        featureType: "ai_matching" as const,
        featureId: ids.jobAiCoach,
        description: "AI match insights for coaching contracts",
        metadata: JSON.stringify({ matchesReviewed: 6 }),
    },
];

const userSubscriptionSeeds = [
    {
        id: ids.userSubscriptionMarcus,
        userId: ids.userMarcus,
        creditPackageId: ids.creditPackageCareerMonthly,
        stripeSubscriptionId: "sub_marcus_001",
        status: "active" as const,
        currentPeriodStart: new Date("2025-01-15T10:00:00Z"),
        currentPeriodEnd: new Date("2025-02-15T10:00:00Z"),
        cancelAtPeriodEnd: false,
        canceledAt: null,
    },
];

async function seed() {
    console.info("🌱 Seeding ApplyMint AI database...");

    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    const now = new Date();

    await db.transaction(async (tx) => {
        for (const user of userSeeds) {
            await tx.execute(sql`
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, last_sign_in_at, aud, role, raw_user_meta_data, raw_app_meta_data, created_at, updated_at)
        VALUES (${user.id}::uuid, ${user.email}, crypt(${user.password}, gen_salt('bf')), now(), now(), 'authenticated', 'authenticated', ${
                JSON.stringify({
                    first_name: user.firstName,
                    last_name: user.lastName,
                })
            }::jsonb, '{"provider":"email","providers":["email"]}'::jsonb, now(), now())
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          raw_user_meta_data = EXCLUDED.raw_user_meta_data,
          updated_at = now();
      `);

            await tx
                .insert(profiles)
                .values({
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phoneNumber: user.phoneNumber,
                    bio: user.bio,
                    location: user.location,
                    website: user.website,
                    linkedinUrl: user.linkedinUrl,
                    githubUrl: user.githubUrl,
                    twitterUrl: user.twitterUrl,
                    portfolioUrl: user.portfolioUrl,
                    currentPosition: user.currentPosition,
                    company: user.company,
                    yearsOfExperience: user.yearsOfExperience,
                    availabilityStatus: user.availabilityStatus,
                    preferredWorkType: user.preferredWorkType,
                    profileVisibility: user.profileVisibility,
                    credit: user.credit,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: profiles.id,
                    set: {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phoneNumber: user.phoneNumber,
                        bio: user.bio,
                        location: user.location,
                        website: user.website,
                        linkedinUrl: user.linkedinUrl,
                        githubUrl: user.githubUrl,
                        twitterUrl: user.twitterUrl,
                        portfolioUrl: user.portfolioUrl,
                        currentPosition: user.currentPosition,
                        company: user.company,
                        yearsOfExperience: user.yearsOfExperience,
                        availabilityStatus: user.availabilityStatus,
                        preferredWorkType: user.preferredWorkType,
                        profileVisibility: user.profileVisibility,
                        credit: user.credit,
                        updatedAt: now,
                    },
                });
        }

        for (const pref of preferenceSeeds) {
            await tx
                .insert(userPreferences)
                .values({
                    id: pref.id,
                    userId: pref.userId,
                    jobAlerts: pref.jobAlerts,
                    emailNotifications: pref.emailNotifications,
                    smsNotifications: pref.smsNotifications,
                    preferredJobTypes: pref.preferredJobTypes,
                    preferredLocations: pref.preferredLocations,
                    salaryMin: pref.salaryMin,
                    salaryMax: pref.salaryMax,
                    salaryCurrency: pref.salaryCurrency,
                    remoteWork: pref.remoteWork,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: userPreferences.userId,
                    set: {
                        jobAlerts: pref.jobAlerts,
                        emailNotifications: pref.emailNotifications,
                        smsNotifications: pref.smsNotifications,
                        preferredJobTypes: pref.preferredJobTypes,
                        preferredLocations: pref.preferredLocations,
                        salaryMin: pref.salaryMin,
                        salaryMax: pref.salaryMax,
                        salaryCurrency: pref.salaryCurrency,
                        remoteWork: pref.remoteWork,
                        updatedAt: now,
                    },
                });
        }

        for (const company of companySeeds) {
            await tx
                .insert(companies)
                .values({
                    id: company.id,
                    name: company.name,
                    description: company.description,
                    website: company.website,
                    logoUrl: company.logoUrl,
                    industry: company.industry,
                    size: company.size,
                    location: company.location,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: companies.id,
                    set: {
                        name: company.name,
                        description: company.description,
                        website: company.website,
                        logoUrl: company.logoUrl,
                        industry: company.industry,
                        size: company.size,
                        location: company.location,
                        updatedAt: now,
                    },
                });
        }

        for (const job of jobSeeds) {
            await tx
                .insert(jobs)
                .values({
                    id: job.id,
                    title: job.title,
                    companyId: job.companyId,
                    location: job.location,
                    isRemote: job.isRemote,
                    jobType: job.jobType,
                    experienceLevel: job.experienceLevel,
                    description: job.description,
                    requirements: job.requirements,
                    responsibilities: job.responsibilities,
                    benefits: job.benefits,
                    salaryMin: job.salaryMin,
                    salaryMax: job.salaryMax,
                    salaryCurrency: job.salaryCurrency,
                    skills: job.skills,
                    postedAt: job.postedAt,
                    applicationDeadline: job.applicationDeadline,
                    isActive: job.isActive,
                    externalJobId: job.externalJobId,
                    externalSource: job.externalSource,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: jobs.id,
                    set: {
                        title: job.title,
                        companyId: job.companyId,
                        location: job.location,
                        isRemote: job.isRemote,
                        jobType: job.jobType,
                        experienceLevel: job.experienceLevel,
                        description: job.description,
                        requirements: job.requirements,
                        responsibilities: job.responsibilities,
                        benefits: job.benefits,
                        salaryMin: job.salaryMin,
                        salaryMax: job.salaryMax,
                        salaryCurrency: job.salaryCurrency,
                        skills: job.skills,
                        applicationDeadline: job.applicationDeadline,
                        isActive: job.isActive,
                        externalJobId: job.externalJobId,
                        externalSource: job.externalSource,
                        updatedAt: now,
                    },
                });
        }

        for (const resume of resumeSeeds) {
            await tx
                .insert(resumes)
                .values({
                    id: resume.id,
                    userId: resume.userId,
                    title: resume.title,
                    summary: resume.summary,
                    isDefault: resume.isDefault,
                    fileName: resume.fileName,
                    fileUrl: resume.fileUrl,
                    fileSize: resume.fileSize,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: resumes.id,
                    set: {
                        title: resume.title,
                        summary: resume.summary,
                        isDefault: resume.isDefault,
                        fileName: resume.fileName,
                        fileUrl: resume.fileUrl,
                        fileSize: resume.fileSize,
                        updatedAt: now,
                    },
                });
        }

        for (const workExperience of workExperienceSeeds) {
            await tx
                .insert(workExperiences)
                .values({
                    id: workExperience.id,
                    resumeId: workExperience.resumeId,
                    company: workExperience.company,
                    position: workExperience.position,
                    location: workExperience.location,
                    startDate: workExperience.startDate,
                    endDate: workExperience.endDate,
                    isCurrent: workExperience.isCurrent,
                    description: workExperience.description,
                    achievements: workExperience.achievements,
                    skills: workExperience.skills,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: workExperiences.id,
                    set: {
                        company: workExperience.company,
                        position: workExperience.position,
                        location: workExperience.location,
                        startDate: workExperience.startDate,
                        endDate: workExperience.endDate,
                        isCurrent: workExperience.isCurrent,
                        description: workExperience.description,
                        achievements: workExperience.achievements,
                        skills: workExperience.skills,
                        updatedAt: now,
                    },
                });
        }

        for (const education of educationSeeds) {
            await tx
                .insert(educations)
                .values({
                    id: education.id,
                    resumeId: education.resumeId,
                    institution: education.institution,
                    degree: education.degree,
                    fieldOfStudy: education.fieldOfStudy,
                    startDate: education.startDate,
                    endDate: education.endDate,
                    gpa: education.gpa,
                    description: education.description,
                    achievements: education.achievements,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: educations.id,
                    set: {
                        institution: education.institution,
                        degree: education.degree,
                        fieldOfStudy: education.fieldOfStudy,
                        startDate: education.startDate,
                        endDate: education.endDate,
                        gpa: education.gpa,
                        description: education.description,
                        achievements: education.achievements,
                        updatedAt: now,
                    },
                });
        }

        for (const skill of skillSeeds) {
            await tx
                .insert(skills)
                .values({
                    id: skill.id,
                    resumeId: skill.resumeId,
                    name: skill.name,
                    level: skill.level,
                    category: skill.category,
                    yearsOfExperience: skill.yearsOfExperience,
                    description: skill.description,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: skills.id,
                    set: {
                        name: skill.name,
                        level: skill.level,
                        category: skill.category,
                        yearsOfExperience: skill.yearsOfExperience,
                        description: skill.description,
                        updatedAt: now,
                    },
                });
        }

        for (const certification of certificationSeeds) {
            await tx
                .insert(certifications)
                .values({
                    id: certification.id,
                    resumeId: certification.resumeId,
                    name: certification.name,
                    issuer: certification.issuer,
                    issueDate: certification.issueDate,
                    expiryDate: certification.expiryDate,
                    credentialId: certification.credentialId,
                    credentialUrl: certification.credentialUrl,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: certifications.id,
                    set: {
                        name: certification.name,
                        issuer: certification.issuer,
                        issueDate: certification.issueDate,
                        expiryDate: certification.expiryDate,
                        credentialId: certification.credentialId,
                        credentialUrl: certification.credentialUrl,
                        updatedAt: now,
                    },
                });
        }

        for (const project of projectSeeds) {
            await tx
                .insert(projects)
                .values({
                    id: project.id,
                    resumeId: project.resumeId,
                    title: project.title,
                    description: project.description,
                    technologies: project.technologies,
                    projectUrl: project.projectUrl,
                    githubUrl: project.githubUrl,
                    startDate: project.startDate,
                    endDate: project.endDate,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: projects.id,
                    set: {
                        title: project.title,
                        description: project.description,
                        technologies: project.technologies,
                        projectUrl: project.projectUrl,
                        githubUrl: project.githubUrl,
                        startDate: project.startDate,
                        endDate: project.endDate,
                        updatedAt: now,
                    },
                });
        }

        for (const language of languageSeeds) {
            await tx
                .insert(languages)
                .values({
                    id: language.id,
                    resumeId: language.resumeId,
                    name: language.name,
                    proficiency: language.proficiency,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: languages.id,
                    set: {
                        name: language.name,
                        proficiency: language.proficiency,
                        updatedAt: now,
                    },
                });
        }

        for (const application of jobApplicationSeeds) {
            await tx
                .insert(jobApplications)
                .values({
                    id: application.id,
                    jobId: application.jobId,
                    userId: application.userId,
                    resumeId: application.resumeId,
                    coverLetter: application.coverLetter,
                    status: application.status,
                    appliedAt: application.appliedAt,
                    updatedAt: now,
                    notes: application.notes,
                })
                .onConflictDoUpdate({
                    target: jobApplications.id,
                    set: {
                        coverLetter: application.coverLetter,
                        status: application.status,
                        updatedAt: now,
                        notes: application.notes,
                    },
                });
        }

        for (const saved of savedJobSeeds) {
            await tx
                .insert(savedJobs)
                .values({
                    id: saved.id,
                    jobId: saved.jobId,
                    userId: saved.userId,
                    savedAt: saved.savedAt,
                    notes: saved.notes,
                })
                .onConflictDoUpdate({
                    target: savedJobs.id,
                    set: {
                        savedAt: saved.savedAt,
                        notes: saved.notes,
                    },
                });
        }

        for (const alert of jobAlertSeeds) {
            await tx
                .insert(jobAlerts)
                .values({
                    id: alert.id,
                    userId: alert.userId,
                    name: alert.name,
                    keywords: alert.keywords,
                    location: alert.location,
                    jobTypes: alert.jobTypes,
                    salaryMin: alert.salaryMin,
                    salaryMax: alert.salaryMax,
                    isRemote: alert.isRemote,
                    frequency: alert.frequency,
                    isActive: alert.isActive,
                    lastSent: alert.lastSent,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: jobAlerts.id,
                    set: {
                        name: alert.name,
                        keywords: alert.keywords,
                        location: alert.location,
                        jobTypes: alert.jobTypes,
                        salaryMin: alert.salaryMin,
                        salaryMax: alert.salaryMax,
                        isRemote: alert.isRemote,
                        frequency: alert.frequency,
                        isActive: alert.isActive,
                        lastSent: alert.lastSent,
                        updatedAt: now,
                    },
                });
        }

        for (const session of interviewSessionSeeds) {
            await tx
                .insert(interviewSessions)
                .values({
                    id: session.id,
                    userId: session.userId,
                    title: session.title,
                    type: session.type,
                    status: session.status,
                    duration: session.duration,
                    score: session.score,
                    feedback: session.feedback,
                    metadata: session.metadata,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: interviewSessions.id,
                    set: {
                        title: session.title,
                        type: session.type,
                        status: session.status,
                        duration: session.duration,
                        score: session.score,
                        feedback: session.feedback,
                        metadata: session.metadata,
                        updatedAt: now,
                    },
                });
        }

        for (const question of interviewQuestionSeeds) {
            await tx
                .insert(interviewQuestions)
                .values({
                    id: question.id,
                    sessionId: question.sessionId,
                    question: question.question,
                    type: question.type,
                    difficulty: question.difficulty,
                    expectedAnswer: question.expectedAnswer,
                    timeLimit: question.timeLimit,
                    order: question.order,
                    createdAt: now,
                })
                .onConflictDoUpdate({
                    target: interviewQuestions.id,
                    set: {
                        question: question.question,
                        type: question.type,
                        difficulty: question.difficulty,
                        expectedAnswer: question.expectedAnswer,
                        timeLimit: question.timeLimit,
                        order: question.order,
                    },
                });
        }

        for (const response of interviewResponseSeeds) {
            await tx
                .insert(interviewResponses)
                .values({
                    id: response.id,
                    questionId: response.questionId,
                    response: response.response,
                    responseTime: response.responseTime,
                    score: response.score,
                    feedback: response.feedback,
                    audioUrl: response.audioUrl,
                    createdAt: now,
                })
                .onConflictDoUpdate({
                    target: interviewResponses.id,
                    set: {
                        response: response.response,
                        responseTime: response.responseTime,
                        score: response.score,
                        feedback: response.feedback,
                        audioUrl: response.audioUrl,
                    },
                });
        }

        for (const notification of notificationSeeds) {
            await tx
                .insert(notifications)
                .values({
                    id: notification.id,
                    userId: notification.userId,
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    isRead: notification.isRead,
                    actionUrl: notification.actionUrl,
                    metadata: notification.metadata,
                    createdAt: now,
                })
                .onConflictDoUpdate({
                    target: notifications.id,
                    set: {
                        type: notification.type,
                        title: notification.title,
                        message: notification.message,
                        isRead: notification.isRead,
                        actionUrl: notification.actionUrl,
                        metadata: notification.metadata,
                    },
                });
        }

        for (const analytic of userAnalyticsSeeds) {
            await tx
                .insert(userAnalytics)
                .values({
                    id: analytic.id,
                    userId: analytic.userId,
                    eventType: analytic.eventType,
                    eventData: analytic.eventData,
                    sessionId: analytic.sessionId,
                    ipAddress: analytic.ipAddress,
                    userAgent: analytic.userAgent,
                    referrer: analytic.referrer,
                    pageUrl: analytic.pageUrl,
                    date: analytic.date,
                    createdAt: now,
                })
                .onConflictDoUpdate({
                    target: userAnalytics.id,
                    set: {
                        eventType: analytic.eventType,
                        eventData: analytic.eventData,
                        sessionId: analytic.sessionId,
                        ipAddress: analytic.ipAddress,
                        userAgent: analytic.userAgent,
                        referrer: analytic.referrer,
                        pageUrl: analytic.pageUrl,
                        date: analytic.date,
                    },
                });
        }

        for (const creditPackage of creditPackageSeeds) {
            await tx
                .insert(creditPackages)
                .values({
                    id: creditPackage.id,
                    name: creditPackage.name,
                    description: creditPackage.description,
                    credits: creditPackage.credits,
                    price: creditPackage.price,
                    currency: creditPackage.currency,
                    packageType: creditPackage.packageType,
                    billingInterval: creditPackage.billingInterval,
                    stripePriceId: creditPackage.stripePriceId,
                    isActive: creditPackage.isActive,
                    sortOrder: creditPackage.sortOrder,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: creditPackages.id,
                    set: {
                        name: creditPackage.name,
                        description: creditPackage.description,
                        credits: creditPackage.credits,
                        price: creditPackage.price,
                        currency: creditPackage.currency,
                        packageType: creditPackage.packageType,
                        billingInterval: creditPackage.billingInterval,
                        stripePriceId: creditPackage.stripePriceId,
                        isActive: creditPackage.isActive,
                        sortOrder: creditPackage.sortOrder,
                        updatedAt: now,
                    },
                });
        }

        for (const featureCost of featureCreditCostSeeds) {
            await tx
                .insert(featureCreditCosts)
                .values({
                    featureType: featureCost.featureType,
                    featureName: featureCost.featureName,
                    creditCost: featureCost.creditCost,
                    description: featureCost.description,
                    isActive: featureCost.isActive,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: featureCreditCosts.featureType,
                    set: {
                        featureName: featureCost.featureName,
                        creditCost: featureCost.creditCost,
                        description: featureCost.description,
                        isActive: featureCost.isActive,
                        updatedAt: now,
                    },
                });
        }

        for (const transaction of creditTransactionSeeds) {
            await tx
                .insert(creditTransactions)
                .values({
                    id: transaction.id,
                    userId: transaction.userId,
                    transactionType: transaction.transactionType,
                    amount: transaction.amount,
                    balanceBefore: transaction.balanceBefore,
                    balanceAfter: transaction.balanceAfter,
                    creditPackageId: transaction.creditPackageId,
                    stripePaymentIntentId: transaction.stripePaymentIntentId,
                    price: transaction.price,
                    featureType: transaction.featureType,
                    featureId: transaction.featureId,
                    description: transaction.description,
                    metadata: transaction.metadata,
                    createdAt: now,
                })
                .onConflictDoUpdate({
                    target: creditTransactions.id,
                    set: {
                        transactionType: transaction.transactionType,
                        amount: transaction.amount,
                        balanceBefore: transaction.balanceBefore,
                        balanceAfter: transaction.balanceAfter,
                        creditPackageId: transaction.creditPackageId,
                        stripePaymentIntentId:
                            transaction.stripePaymentIntentId,
                        price: transaction.price,
                        featureType: transaction.featureType,
                        featureId: transaction.featureId,
                        description: transaction.description,
                        metadata: transaction.metadata,
                    },
                });
        }

        for (const subscription of userSubscriptionSeeds) {
            await tx
                .insert(userSubscriptions)
                .values({
                    id: subscription.id,
                    userId: subscription.userId,
                    creditPackageId: subscription.creditPackageId,
                    stripeSubscriptionId: subscription.stripeSubscriptionId,
                    status: subscription.status,
                    currentPeriodStart: subscription.currentPeriodStart,
                    currentPeriodEnd: subscription.currentPeriodEnd,
                    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                    canceledAt: subscription.canceledAt,
                    createdAt: now,
                    updatedAt: now,
                })
                .onConflictDoUpdate({
                    target: userSubscriptions.id,
                    set: {
                        creditPackageId: subscription.creditPackageId,
                        stripeSubscriptionId: subscription.stripeSubscriptionId,
                        status: subscription.status,
                        currentPeriodStart: subscription.currentPeriodStart,
                        currentPeriodEnd: subscription.currentPeriodEnd,
                        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                        canceledAt: subscription.canceledAt,
                        updatedAt: now,
                    },
                });
        }
    });

    console.info("✅ Database seed completed successfully.");
}

seed()
    .catch((error) => {
        console.error("❌ Database seed failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await closeConnection();
    });
