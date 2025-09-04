import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">E</span>
              </div>
              <span className="font-bold text-lg">EventHub</span>
            </div>
            <p className="text-small text-muted-foreground">
              Discover and register for amazing events. Built as a Progressive Web App.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Product</h3>
            <ul className="space-y-2 text-small">
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-foreground transition-micro">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-muted-foreground hover:text-foreground transition-micro">
                  Create Event
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-micro">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <ul className="space-y-2 text-small">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground transition-micro">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-micro">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-muted-foreground hover:text-foreground transition-micro">
                  API Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2 text-small">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-micro">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-micro">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-small text-muted-foreground">© 2024 EventHub. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button className="text-small text-muted-foreground hover:text-foreground transition-micro">
              Analytics Opt-out
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
