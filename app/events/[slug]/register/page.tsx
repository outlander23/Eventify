"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface RegistrationPageProps {
  params: {
    slug: string
  }
}

export default function RegistrationPage({ params }: RegistrationPageProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    ticketQuantity: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    dietaryRestrictions: "",
    agreeToTerms: false,
    marketingConsent: false,
  })

  // Mock event data
  const event = {
    title: "Next.js Conference 2024",
    date: "Dec 15, 2024",
    time: "9:00 AM - 6:00 PM",
    location: "Moscone Center, San Francisco, CA",
    price: 0,
    currency: "$",
  }

  const steps = [
    { number: 1, title: "Ticket Selection", completed: currentStep > 1 },
    { number: 2, title: "Attendee Details", completed: currentStep > 2 },
    { number: 3, title: "Confirmation", completed: currentStep > 3 },
  ]

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
    // Handle registration submission
    console.log("Registration submitted:", formData)
    setCurrentStep(4) // Success step
  }

  if (currentStep === 4) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-12">
          <div className="container-app max-w-2xl mx-auto">
            <Card className="card-elevated text-center">
              <CardContent className="p-12">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <h1 className="text-h1 text-foreground mb-4">Registration Successful!</h1>
                <p className="text-body text-muted-foreground mb-8">
                  You're all set for {event.title}. We've sent a confirmation email with your ticket and event details.
                </p>
                <div className="space-y-4">
                  <Button asChild className="w-full">
                    <Link href="/account/registrations">View My Registrations</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/events">Browse More Events</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container-app max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/events/${params.slug}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Event
              </Link>
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-small font-medium
                    ${
                      step.completed
                        ? "bg-success text-white"
                        : currentStep === step.number
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }
                  `}
                  >
                    {step.completed ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${step.completed ? "bg-success" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <h2 className="text-h2 text-foreground">{steps[currentStep - 1]?.title}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Registration Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="quantity" className="text-body font-medium">
                          Number of Tickets
                        </Label>
                        <Select
                          value={formData.ticketQuantity.toString()}
                          onValueChange={(value) =>
                            setFormData({ ...formData, ticketQuantity: Number.parseInt(value) })
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "Ticket" : "Tickets"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="border-t border-border pt-6">
                        <div className="flex justify-between items-center text-body">
                          <span>
                            Subtotal ({formData.ticketQuantity} ticket{formData.ticketQuantity > 1 ? "s" : ""})
                          </span>
                          <span className="font-medium">
                            {event.price === 0 ? "Free" : `${event.currency}${event.price * formData.ticketQuantity}`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-h3 font-bold mt-2">
                          <span>Total</span>
                          <span>
                            {event.price === 0 ? "Free" : `${event.currency}${event.price * formData.ticketQuantity}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="mt-2"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="mt-2"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="mt-2"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="organization">Organization</Label>
                          <Input
                            id="organization"
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="dietary">Dietary Restrictions</Label>
                        <Input
                          id="dietary"
                          value={formData.dietaryRestrictions}
                          onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                          className="mt-2"
                          placeholder="Please specify any dietary restrictions or allergies"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-h3 text-foreground mb-4">Review Your Registration</h3>
                        <div className="space-y-3 text-small">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span>
                              {formData.firstName} {formData.lastName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span>{formData.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tickets:</span>
                            <span>{formData.ticketQuantity}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span>
                              {event.price === 0 ? "Free" : `${event.currency}${event.price * formData.ticketQuantity}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 border-t border-border pt-6">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="terms"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, agreeToTerms: checked as boolean })
                            }
                          />
                          <Label htmlFor="terms" className="text-small leading-relaxed">
                            I agree to the{" "}
                            <Link href="/terms" className="text-primary hover:underline">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-primary hover:underline">
                              Privacy Policy
                            </Link>{" "}
                            *
                          </Label>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="marketing"
                            checked={formData.marketingConsent}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, marketingConsent: checked as boolean })
                            }
                          />
                          <Label htmlFor="marketing" className="text-small leading-relaxed">
                            I'd like to receive updates about future events and promotions
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex justify-between pt-8 border-t border-border">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                      Back
                    </Button>

                    {currentStep < 3 ? (
                      <Button onClick={handleNext}>Continue</Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={!formData.agreeToTerms}
                        className="bg-primary hover:bg-primary-variant"
                      >
                        Complete Registration
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Event Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-h3">Event Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">{event.title}</h4>
                    <div className="space-y-2 text-small text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-small mb-2">
                      <span>Tickets ({formData.ticketQuantity})</span>
                      <span>
                        {event.price === 0 ? "Free" : `${event.currency}${event.price * formData.ticketQuantity}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>
                        {event.price === 0 ? "Free" : `${event.currency}${event.price * formData.ticketQuantity}`}
                      </span>
                    </div>
                  </div>

                  {event.price === 0 && (
                    <Badge variant="secondary" className="w-full justify-center">
                      Free Event
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
