import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Mail, Phone, MapPin } from "lucide-react"

export function GovernmentFooter() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">About FRA Atlas</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A comprehensive decision support system for Forest Rights Act claims management, developed by the
              Government of India.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Ministry of Tribal Affairs, New Delhi
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                Forest Rights Act 2006
              </Button>
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                Claim Guidelines
              </Button>
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                User Manual
              </Button>
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                Training Resources
              </Button>
            </div>
          </div>

          {/* Government Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Government Portals</h3>
            <div className="space-y-2">
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                <ExternalLink className="h-3 w-3 mr-1" />
                India.gov.in
              </Button>
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                <ExternalLink className="h-3 w-3 mr-1" />
                MyGov.in
              </Button>
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                <ExternalLink className="h-3 w-3 mr-1" />
                Digital India
              </Button>
              <Button variant="link" className="h-auto p-0 text-sm justify-start">
                <ExternalLink className="h-3 w-3 mr-1" />
                Data.gov.in
              </Button>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Support</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                1800-XXX-XXXX (Toll Free)
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                support@fra-atlas.gov.in
              </div>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Help & Support
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>© 2024 Government of India. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="link" className="h-auto p-0 text-sm">
              Privacy Policy
            </Button>
            <Button variant="link" className="h-auto p-0 text-sm">
              Terms of Use
            </Button>
            <Button variant="link" className="h-auto p-0 text-sm">
              Accessibility
            </Button>
            <Button variant="link" className="h-auto p-0 text-sm">
              RTI
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
