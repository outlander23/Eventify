"use client";

import { Button } from "@/components/ui/button";
// Input removed to keep header minimal
import { Search, User, Menu } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/lib/auth";
import { OfflineStatus } from "@/components/pwa/offline-status";

export function Header() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, loading } = useAuth();

  // Open auth modal when other components dispatch a global event
  useEffect(() => {
    const handler = () => setAuthModalOpen(true);
    window.addEventListener("open-auth", handler);
    return () => window.removeEventListener("open-auth", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="container-app">
        <div
          className="flex items-center justify-between h-16 md:h-16"
          style={{ height: "var(--header-height-mobile)" }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                E
              </span>
            </div>
            <span className="font-bold text-xl text-foreground">EventHub</span>
          </Link>

          {/* Simplified header: keep brand centered and minimal actions */}
          <div className="flex-1" />

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <OfflineStatus />

            <Button variant="ghost" size="sm" asChild>
              <Link href="/create">Create Event</Link>
            </Button>

            {loading ? (
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            ) : user ? (
              <UserMenu />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAuthModalOpen(true)}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <OfflineStatus />

            <Button variant="ghost" size="sm">
              <Search className="w-5 h-5" />
            </Button>
            {user ? (
              <UserMenu />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAuthModalOpen(true)}
              >
                <User className="w-5 h-5" />
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </header>
  );
}
