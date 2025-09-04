"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

export default function RegisterPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    dietaryRestrictions: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  })

  // Mock event data
  const event = {
    title: "Next.js Conference 2024",
    date: "2024-12-15",
    time: "09:00",
    location: "Moscone Center, San Francisco, CA",
    price: 0,
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // In real app, submit registration data
    console.log("Registration submitted:", formData)
    setCurrentStep(4) // Success step
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email
      case 2:
        return formData.agreeToTerms
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="container-app max-w-2xl">
          {/* Back Navigation */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Event
          </Button>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 3 && <div className={`w-12 h-0.5 mx-2 ${step < currentStep ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-center">
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Review & Confirm"}
                {currentStep === 3 && "Payment"}
                {currentStep === 4 && "Registration Complete!"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => handleInputChange("organization", e.target.value)}
                      placeholder="Enter your organization (optional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dietary">Dietary Restrictions</Label>
                    <Input
                      id="dietary"
                      value={formData.dietaryRestrictions}
                      onChange={(e) => handleInputChange("dietaryRestrictions", e.target.value)}
                      placeholder="Any dietary restrictions or allergies"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Review & Confirm */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Event Summary */}
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium text-foreground mb-2">{event.title}</h3>
                    <div className="text-small text-muted-foreground space-y-1">
                      <div>
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </div>
                      <div>{event.location}</div>
                      <div className="font-medium text-green-600">{event.price === 0 ? "Free" : `$${event.price}`}</div>
                    </div>
                  </div>

                  {/* Registration Details */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Registration Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-small">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <div>
                          {formData.firstName} {formData.lastName}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <div>{formData.email}</div>
                      </div>
                      {formData.phone && (
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <div>{formData.phone}</div>
                        </div>
                      )}
                      {formData.organization && (
                        <div>
                          <span className="text-muted-foreground">Organization:</span>
                          <div>{formData.organization}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                      />
                      <Label htmlFor="terms" className="text-small leading-relaxed">
                        I agree to the{" "}
                        <a href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.subscribeNewsletter}
                        onCheckedChange={(checked) => handleInputChange("subscribeNewsletter", checked)}
                      />
                      <Label htmlFor="newsletter" className="text-small leading-relaxed">
                        Subscribe to our newsletter for event updates and announcements
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {event.price === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-h3 text-foreground mb-2">Free Event</h3>
                      <p className="text-body text-muted-foreground">
                        No payment required. Click confirm to complete your registration.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-h3 text-foreground">Payment Information</h3>
                      <p className="text-body text-muted-foreground">
                        Payment processing would be integrated here (Stripe, PayPal, etc.)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Success */}
              {currentStep === 4 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-h3 text-foreground mb-2">Registration Successful!</h3>
                  <p className="text-body text-muted-foreground mb-6">
                    You're all set! A confirmation email has been sent to {formData.email}.
                  </p>
                  <div className="space-y-3">
                    <Button onClick={() => navigate("/account/registrations")}>View My Registrations</Button>
                    <Button variant="outline" onClick={() => navigate("/events")}>
                      Browse More Events
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between pt-6 border-t">
                  <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <Button onClick={currentStep === 3 ? handleSubmit : handleNext} disabled={!isStepValid()}>
                    {currentStep === 3 ? "Confirm Registration" : "Next"}
                    {currentStep < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
