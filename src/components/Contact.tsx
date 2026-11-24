import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import portfolioData from "../data/portfolio.json";
import SocialLinks from "./SocialLinks";

gsap.registerPlugin(ScrollTrigger);

const projectTypeOptions = [
  "Web Development",
  "Full-Stack Application",
  "Mobile Application",
  "Backend / API Development",
  "AI Automation",
  "AI Chatbot / RAG",
  "DevOps / Cloud",
  "Other",
];

const budgetRanges = [
  "₹5,000 - ₹10,000",
  "₹10,000 - ₹25,000",
  "₹25,000 - ₹50,000",
  "₹50,000+",
  "To be discussed",
];

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "Full-Stack Application",
    budget: "₹10,000 - ₹25,000",
    projectUrl: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Listen for custom event triggered by Services, Pricing, or AI Automation cards
    const handleProjectTypeSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ projectType: string }>;
      if (customEvent.detail?.projectType) {
        setFormData((prev) => ({
          ...prev,
          projectType: customEvent.detail.projectType,
        }));
      }
    };

    window.addEventListener("select-project-type", handleProjectTypeSelect);
    return () =>
      window.removeEventListener("select-project-type", handleProjectTypeSelect);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const constructEmailBody = () => {
    return `Hi Tanmay,

I would like to discuss a project with you.

Here are the details:
- Name: ${formData.name}
- Email: ${formData.email}
- Project Type: ${formData.projectType}
- Estimated Budget: ${formData.budget}
- Reference URL: ${formData.projectUrl || "N/A"}

Project Overview:
${formData.message}

Looking forward to your response!`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in your name, email, and project description.");
      return;
    }

    const emailSubject = encodeURIComponent(
      `Project Inquiry: ${formData.projectType} - ${formData.name}`
    );
    const emailBody = encodeURIComponent(constructEmailBody());
    const mailtoUrl = `mailto:${portfolioData.personal.email}?subject=${emailSubject}&body=${emailBody}`;

    // Open mailto handler
    window.location.href = mailtoUrl;

    // Also copy to clipboard for convenience if webmail is used
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(constructEmailBody());
    }

    setIsSubmitted(true);
    toast.success("Draft prepared! Your email client has been launched.", {
      description: "Project details have also been copied to your clipboard.",
    });
  };

  const copyToClipboard = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(constructEmailBody());
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/40">
      <div className="max-w-6xl mx-auto">
        {/* Top Section Index Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest pb-8 border-b border-border/50 mb-12 sm:mb-16">
          <div className="flex items-center gap-4">
            <span className="font-bold text-foreground">(07)</span>
            <span>GET IN TOUCH</span>
          </div>
          <span>Direct Inquiry & Booking</span>
        </div>

        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-14">
          <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider mb-3 px-3 py-1">
            Get In Touch
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Let's Discuss Your Project
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Have an application to build or a business workflow to automate? Reach out directly and I'll reply within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Discovery Call */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-border/70 bg-card/90 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-foreground">
                  Direct Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Email</p>
                    <a
                      href={`mailto:${portfolioData.personal.email}`}
                      className="text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {portfolioData.personal.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Phone / WhatsApp</p>
                    <a
                      href={`tel:${portfolioData.personal.phone}`}
                      className="text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {portfolioData.personal.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Location</p>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">
                      {portfolioData.personal.location} (IST / UTC+5:30)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Direct Cal.com Booking Card */}
            <Card className="border border-primary/40 bg-card/90 shadow-xs relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Prefer a 15-Min Quick Call?</span>
                </div>
                <h3 className="font-bold text-foreground text-base mb-2">
                  Book a Discovery Call Directly
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Schedule a convenient 15-minute Google Meet to discuss requirements, architecture, or workflow automation feasibility.
                </p>
                <Button
                  size="sm"
                  asChild
                  className="w-full font-semibold text-xs h-9 gap-1.5"
                >
                  <a
                    href={portfolioData.personal.calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Open Calendar (Cal.com)</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <div className="pt-2 flex justify-center lg:justify-start">
              <SocialLinks />
            </div>
          </div>

          {/* Interactive Lead Capture Form */}
          <div className="lg:col-span-7">
            <Card className="border border-border/70 bg-card shadow-sm p-6 sm:p-8 rounded-xl">
              <CardHeader className="p-0 pb-6 border-b border-border/50">
                <CardTitle className="text-xl font-bold text-foreground">
                  Send a Project Brief
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Fill in your requirements below. The form prepares your inquiry and connects directly to my inbox.
                </p>
              </CardHeader>

              {isSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Project Brief Created!
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Your inquiry has been formulated. If your mail client didn't open automatically, you can copy the full brief text and send it directly.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="text-xs font-semibold gap-1.5 w-full sm:w-auto"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Brief to Clipboard</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs font-semibold w-full sm:w-auto"
                    >
                      <span>Edit Brief</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Your Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Johnson"
                        required
                        className="text-xs sm:text-sm h-10"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Your Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@example.com"
                        required
                        className="text-xs sm:text-sm h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Project Type
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        {projectTypeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Estimated Budget
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Project Reference / Existing Website URL (Optional)
                    </label>
                    <Input
                      name="projectUrl"
                      value={formData.projectUrl}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com or competitor example"
                      className="text-xs sm:text-sm h-10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Project Description *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell me about what you are building, the problem you're looking to solve, or the workflow you want automated..."
                      required
                      className="text-xs sm:text-sm resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-semibold text-xs sm:text-sm h-11 gap-2 shadow-sm"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Project Inquiry</span>
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
