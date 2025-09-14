"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, Leaf, User, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { ModeToggle } from "../ui/mode-toggle";
import { useAuth } from "@/components/auth/auth-provider";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const getInitials = (email: string | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-chart-2 to-chart-1 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">ApplyMint AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
            <ModeToggle />
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!loading && (
              user ? (
                /* Authenticated User Menu */
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                        <AvatarFallback className="bg-gradient-to-r from-chart-2 to-chart-1 text-white">
                          {getInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm">{user.user_metadata?.first_name} {user.user_metadata?.last_name}</p>
                        <p className="w-[200px] truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                /* Unauthenticated User Buttons */
                <>
                  <Button
                    variant="ghost"
                    asChild
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-chart-2 to-chart-1 text-white hover:from-chart-2/90 hover:to-chart-1/90"
                  >
                    <Link href="/register">Get Started Free</Link>
                  </Button>
                </>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {!loading && (
                  user ? (
                    /* Authenticated Mobile Menu */
                    <>
                      <div className="flex items-center space-x-3 px-2 py-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                          <AvatarFallback className="bg-gradient-to-r from-chart-2 to-chart-1 text-white">
                            {getInitials(user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium text-sm">{user.user_metadata?.first_name} {user.user_metadata?.last_name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        asChild
                        className="justify-start"
                      >
                        <Link href="/dashboard">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        asChild
                        className="justify-start"
                      >
                        <Link href="/profile">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        className="justify-start text-destructive hover:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </>
                  ) : (
                    /* Unauthenticated Mobile Menu */
                    <>
                      <Button
                        variant="ghost"
                        asChild
                        className="text-muted-foreground hover:text-primary justify-start"
                      >
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button
                        asChild
                        className="bg-gradient-to-r from-chart-2 to-chart-1 text-white hover:from-chart-2/90 hover:to-chart-1/90"
                      >
                        <Link href="/register">Get Started Free</Link>
                      </Button>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
