import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Quote, Linkedin, Twitter, CheckCircle } from 'lucide-react'

export const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Senior Software Engineer',
      company: 'Google',
      avatar: '/avatars/sarah-chen.jpg',
      rating: 5,
      quote: "ApplyMint AI transformed my job search completely. I went from applying blindly to 50+ jobs to getting 3 offers in just 2 weeks. The AI matching is incredibly accurate!",
      result: "Landed dream job at Google",
      timeToSuccess: "14 days",
      previousRole: "Mid-level Developer",
      linkedin: "https://linkedin.com/in/sarahchen"
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      role: 'Product Manager',
      company: 'Microsoft',
      avatar: '/avatars/marcus-johnson.jpg',
      rating: 5,
      quote: "The interview prep feature is a game-changer. I felt confident walking into every interview because ApplyMint AI gave me company-specific insights and practice questions.",
      result: "40% salary increase",
      timeToSuccess: "3 weeks",
      previousRole: "Associate PM",
      twitter: "https://twitter.com/marcuspm"
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'UX Designer',
      company: 'Airbnb',
      avatar: '/avatars/elena-rodriguez.jpg',
      rating: 5,
      quote: "As a career changer, I was worried about breaking into tech. ApplyMint AI identified transferable skills I didn't even know I had and matched me with perfect opportunities.",
      result: "Successful career transition",
      timeToSuccess: "6 weeks",
      previousRole: "Marketing Manager",
      linkedin: "https://linkedin.com/in/elenauxdesign"
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Data Scientist',
      company: 'Netflix',
      avatar: '/avatars/david-kim.jpg',
      rating: 5,
      quote: "The AI copilot feature is like having a personal career coach available 24/7. It helped me negotiate my salary and provided invaluable career guidance throughout the process.",
      result: "Senior role at Netflix",
      timeToSuccess: "4 weeks",
      previousRole: "Junior Data Analyst",
      twitter: "https://twitter.com/davidkimdata"
    },
    {
      id: 5,
      name: 'Priya Patel',
      role: 'Engineering Manager',
      company: 'Stripe',
      avatar: '/avatars/priya-patel.jpg',
      rating: 5,
      quote: "The automated application tracking saved me countless hours. I could focus on preparing for interviews instead of managing spreadsheets. Best investment in my career!",
      result: "Leadership role secured",
      timeToSuccess: "5 weeks",
      previousRole: "Senior Engineer",
      linkedin: "https://linkedin.com/in/priyapateldeveloper"
    },
    {
      id: 6,
      name: 'James Wilson',
      role: 'Security Engineer',
      company: 'Coinbase',
      avatar: '/avatars/james-wilson.jpg',
      rating: 5,
      quote: "I was skeptical about AI helping with job search, but ApplyMint proved me wrong. The quality of job matches was exceptional - every application felt purposeful.",
      result: "Remote role at Coinbase",
      timeToSuccess: "3 weeks",
      previousRole: "Cybersecurity Analyst",
      twitter: "https://twitter.com/jamessecurity"
    }
  ]

  const companyLogos = [
    { name: 'Google', logo: '/logos/google.svg' },
    { name: 'Microsoft', logo: '/logos/microsoft.svg' },
    { name: 'Apple', logo: '/logos/apple.svg' },
    { name: 'Netflix', logo: '/logos/netflix.svg' },
    { name: 'Airbnb', logo: '/logos/airbnb.svg' },
    { name: 'Stripe', logo: '/logos/stripe.svg' },
    { name: 'Coinbase', logo: '/logos/coinbase.svg' },
    { name: 'Spotify', logo: '/logos/spotify.svg' }
  ]

  const stats = [
    { value: '10,000+', label: 'Success Stories' },
    { value: '95%', label: 'Job Match Accuracy' },
    { value: '3.2x', label: 'Faster Hiring' },
    { value: '4.8/5', label: 'User Rating' }
  ]

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-gradient-to-br from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-chart-2/10 text-chart-2 border-chart-2/20">
            <Star className="w-4 h-4 mr-2" />
            Success Stories
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Join Thousands Who 
            <span className="bg-gradient-to-r from-chart-2 to-chart-1 bg-clip-text text-transparent block sm:inline">
              {' '}Landed Their Dream Jobs
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Real people, real results. See how ApplyMint AI has transformed careers 
            and helped professionals land positions at top companies worldwide.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="bg-card border-border hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 via-transparent to-chart-1/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <CardContent className="p-6 relative">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-chart-2 mb-4 opacity-60" />
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-chart-4 fill-current" />
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-card-foreground leading-relaxed mb-6 text-sm">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                
                {/* Author Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-12 h-12 border-2 border-chart-2/20">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-chart-2 text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-primary text-sm">{testimonial.name}</h4>
                      <CheckCircle className="w-4 h-4 text-chart-2" />
                    </div>
                    <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                    <p className="text-chart-1 text-xs font-medium">{testimonial.company}</p>
                  </div>
                  <div className="flex space-x-1">
                    {testimonial.linkedin && (
                      <a 
                        href={testimonial.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-chart-2 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {testimonial.twitter && (
                      <a 
                        href={testimonial.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-chart-2 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Results */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-chart-2/10 rounded-lg p-2 text-center">
                    <div className="font-semibold text-chart-2">{testimonial.timeToSuccess}</div>
                    <div className="text-muted-foreground">Time to Success</div>
                  </div>
                  <div className="bg-chart-1/10 rounded-lg p-2 text-center">
                    <div className="font-semibold text-chart-1 text-xs leading-tight">{testimonial.result}</div>
                    <div className="text-muted-foreground">Achievement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Logos */}
        <div className="text-center">
          <p className="text-muted-foreground mb-8 text-lg">
            Trusted by professionals at top companies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            {companyLogos.map((company) => (
              <div key={company.name} className="flex items-center space-x-2 text-muted-foreground font-medium">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold">{company.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <span className="text-sm">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
