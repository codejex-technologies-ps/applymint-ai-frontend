import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Target,
  Users,
  Zap,
  Award,
  Globe,
  Heart,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - ApplyMint AI",
  description:
    "Learn about ApplyMint AI's mission to transform job searching with AI-powered precision. Meet our team and discover our vision for the future of career development.",
};

const stats = [
  {
    value: "50,000+",
    label: "Job Seekers Helped",
    icon: Users,
  },
  {
    value: "10,000+",
    label: "Daily Job Matches",
    icon: Target,
  },
  {
    value: "500+",
    label: "Partner Companies",
    icon: Globe,
  },
  {
    value: "95%",
    label: "Match Accuracy",
    icon: Award,
  },
];

const values = [
  {
    icon: Brain,
    title: "AI-First Innovation",
    description:
      "We believe artificial intelligence should augment human potential, making job searching more intelligent and efficient.",
  },
  {
    icon: Heart,
    title: "Human-Centered Design",
    description:
      "Every feature we build puts the job seeker first, ensuring technology serves real human needs and aspirations.",
  },
  {
    icon: Shield,
    title: "Privacy & Trust",
    description:
      "Your data is protected with enterprise-grade security. We never share your information without explicit consent.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Growth",
    description:
      "We're committed to constantly improving our platform based on user feedback and cutting-edge AI research.",
  },
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    bio: "Former VP at LinkedIn with 15+ years in talent acquisition and AI. Stanford CS graduate passionate about democratizing career opportunities.",
    image: "/api/placeholder/150/150",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO & Co-Founder",
    bio: "Ex-Google AI researcher with expertise in machine learning and natural language processing. MIT PhD in Computer Science.",
    image: "/api/placeholder/150/150",
  },
  {
    name: "Dr. Emily Watson",
    role: "Head of AI Research",
    bio: "Former Amazon Alexa AI scientist with 20+ published papers in recommendation systems and career analytics.",
    image: "/api/placeholder/150/150",
  },
  {
    name: "David Kim",
    role: "Head of Product",
    bio: "Product leader from Uber and Airbnb with deep experience in user-centric design and growth strategy.",
    image: "/api/placeholder/150/150",
  },
];

const milestones = [
  {
    year: "2023",
    title: "Company Founded",
    description:
      "ApplyMint AI was founded with a vision to revolutionize job searching through artificial intelligence.",
  },
  {
    year: "2024",
    title: "AI Platform Launch",
    description:
      "Launched our proprietary AI matching algorithm, helping thousands find their perfect job matches.",
  },
  {
    year: "2024",
    title: "Series A Funding",
    description:
      "Raised $15M Series A to expand our AI capabilities and grow our team of world-class engineers.",
  },
  {
    year: "2025",
    title: "Global Expansion",
    description:
      "Expanded to serve job seekers across 50+ countries with localized AI recommendations.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-chart-1/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              About ApplyMint AI
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Transforming Careers with
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-chart-1 bg-clip-text text-transparent">
                AI-Powered Precision
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              We&apos;re on a mission to make job searching intelligent,
              efficient, and successful for everyone. Our AI technology connects
              talented professionals with their dream opportunities.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card
                  key={index}
                  className="bg-card/80 backdrop-blur-sm border-border text-center"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-full">
                        <IconComponent className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Our Mission
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Making Dream Jobs Accessible to Everyone
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                We believe that finding the right job shouldn&apos;t be a matter
                of luck or connections. Our AI technology levels the playing
                field, giving every job seeker access to intelligent matching,
                personalized recommendations, and career insights that were
                previously available only to a select few.
              </p>
              <p className="text-muted-foreground text-lg mb-8">
                By combining cutting-edge artificial intelligence with deep
                understanding of career development, we&apos;re building a
                future where everyone can find work that truly fits their
                skills, values, and aspirations.
              </p>
              <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                Join Our Mission
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-chart-2/20 rounded-lg">
                      <Brain className="h-6 w-6 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">
                        AI-Powered Matching
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Intelligent algorithms that understand your unique
                        profile
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-chart-3/20 rounded-lg">
                      <Zap className="h-6 w-6 text-chart-3" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">
                        Instant Applications
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Apply to multiple positions with one click
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-chart-4/20 rounded-lg">
                      <Target className="h-6 w-6 text-chart-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">
                        Career Insights
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Data-driven recommendations for career growth
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Our Values
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              What Drives Us Forward
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our core values guide every decision we make and every feature we
              build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card
                  key={index}
                  className="bg-card border-border hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-primary">
                        {value.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Our Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Meet the Minds Behind ApplyMint AI
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our diverse team combines expertise in AI, product development,
              and career services to create the best possible job search
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="bg-card border-border text-center hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="font-semibold text-primary text-lg mb-1">
                    {member.name}
                  </h3>
                  <p className="text-accent font-medium text-sm mb-4">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Our Journey
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Key Milestones
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From inception to global impact, here&quot;s how we&quot;ve grown
              to serve job seekers worldwide.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary/20"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  <Card
                    className={`w-full md:w-5/12 bg-card border-border ${
                      index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Badge className="bg-primary text-primary-foreground px-3 py-1">
                          {milestone.year}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-primary text-lg mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-chart-1/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who&quot;ve found their dream jobs
            with ApplyMint AI. Start your intelligent job search today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
            >
              Get Started Free
            </Button>
            <Button variant="outline" size="lg">
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
