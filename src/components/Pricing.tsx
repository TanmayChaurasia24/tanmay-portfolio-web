import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Plan = {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  period: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
  cta: string;
};

const mobileNew: Plan[] = [
  {
    id: "mobile-basic",
    name: "Basic App Package",
    subtitle: "Frontend Development",
    price: "$799",
    period: "USD",
    highlight: false,
    features: [
      "Mobile app for your users",
      "Converting your design into working app",
      "Connecting to external services",
      "Smooth animations and transitions",
      "Help when you need it",
      "10-30 Day Delivery",
      "Unlimited changes until you are happy",
    ],
    cta: "Start Your Project",
  },
  {
    id: "mobile-mvp",
    name: "MVP Development",
    subtitle: "Complete Starter Package",
    price: "$2,499",
    period: "USD",
    highlight: true,
    badge: "Recommended",
    features: [
      "Mobile app plus admin dashboard",
      "Custom design for your brand",
      "Converting designs into working app",
      "Building your apps brain (backend)",
      "1-3 Month Delivery",
      "Getting your app on App Store & Play Store",
      "Testing everything works perfectly",
      "Unlimited changes until you are happy",
    ],
    cta: "Start Your Project",
  },
  {
    id: "mobile-full",
    name: "Full-Cycle App Development",
    subtitle: "Everything You Need",
    price: "$4,499",
    period: "USD",
    highlight: false,
    features: [
      "User app, business app & admin dashboard",
      "Premium design customized for your brand",
      "Converting designs into working app",
      "Complete backend system built for growth",
      "2-4 Month Delivery",
      "Publishing on App Store & Play Store",
      "Thorough testing for flawless performance",
      "Full control with admin dashboard",
      "Unlimited changes until you are happy",
    ],
    cta: "Start Your Project",
  },
];

const mobileMaintenance: Plan[] = [
  {
    id: "mobile-maint-basic",
    name: "Basic",
    subtitle: "Essential Care Plan",
    price: "$399",
    period: "/month",
    features: [
      "Fix up to 5 bugs each week",
      "Add 1 small feature every 2 months",
      "Monthly app speed improvements",
      "Email help (24-hour response)",
      "Basic app security checks",
      "Updates for new phone systems",
      "Monthly progress summaries",
    ],
    cta: "Get Started",
  },
  {
    id: "mobile-maint-standard",
    name: "Standard",
    subtitle: "Most Popular Plan",
    price: "$799",
    period: "/month",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Fix up to 10 bugs each week",
      "Add 2 new features each month",
      "Speed improvements every two weeks",
      "Urgent help within 6 hours",
      "Monthly security check-ups",
      "Monthly planning call",
      "Quarterly security deep dive",
      "Priority support when you need help",
    ],
    cta: "Get Started",
  },
  {
    id: "mobile-maint-premium",
    name: "Premium",
    subtitle: "Complete Care Package",
    price: "$1,205",
    period: "/month",
    features: [
      "Unlimited bug fixes anytime",
      "Custom feature roadmap for your growth",
      "Weekly speed and performance updates",
      "Round-the-clock help (2-hour response)",
      "Advanced monthly security reviews",
      "Your own personal tech manager",
      "First-in-line for feature requests",
      "Detailed app health reports",
      "Long-term app growth planning",
    ],
    cta: "Get Started",
  },
];

const webNew: Plan[] = [
  {
    id: "web-basic",
    name: "Basic Website Package",
    subtitle: "Frontend Development",
    price: "$499",
    period: "USD",
    features: [
      "Website for your users",
      "Converting your design into working website",
      "Connecting to external services (forms, CMS, analytics)",
      "Smooth animations and transitions",
      "Help when you need it",
      "10-20 Day Delivery",
      "Unlimited changes until you are happy",
    ],
    cta: "Start Your Project",
  },
  {
    id: "web-mvp",
    name: "MVP Development",
    subtitle: "Complete Starter Package",
    price: "$999",
    period: "USD",
    highlight: true,
    badge: "Recommended",
    features: [
      "Website plus admin dashboard",
      "Converting designs into working site",
      "Building your site's backend (APIs, auth)",
      "1-2 Month Delivery",
      "Deploying your site and configuring SEO",
      "Testing everything works perfectly",
      "Unlimited changes until you are happy",
    ],
    cta: "Start Your Project",
  },
  {
    id: "web-full",
    name: "Full-Cycle Web Development",
    subtitle: "Everything You Need",
    price: "$1699",
    period: "USD",
    features: [
      "User site, business portal & admin dashboard",
      "Converting designs into working site",
      "Complete backend system built for growth",
      "2-3 Month Delivery",
      "Publishing & advanced SEO setup",
      "Thorough testing for flawless performance",
      "Full control with admin dashboard",
      "Unlimited changes until you are happy",
    ],
    cta: "Start Your Project",
  },
];

const webMaintenance: Plan[] = [
  {
    id: "web-maint-basic",
    name: "Basic",
    subtitle: "Essential Care Plan",
    price: "$199",
    period: "/month",
    features: [
      "Fix up to 5 issues each week",
      "Add 1 small feature every 2 months",
      "Monthly site speed improvements",
      "Email help (24-hour response)",
      "Basic site security checks",
      "Updates for browser and dependency changes",
      "Monthly progress summaries",
    ],
    cta: "Get Started",
  },
  {
    id: "web-maint-standard",
    name: "Standard",
    subtitle: "Most Popular Plan",
    price: "$499",
    period: "/month",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Fix up to 10 issues each week",
      "Add 2 new features each month",
      "Speed improvements every two weeks",
      "Urgent help within 6 hours",
      "Monthly security check-ups",
      "Monthly planning call",
      "Quarterly security deep dive",
      "Priority support when you need help",
    ],
    cta: "Get Started",
  },
  {
    id: "web-maint-premium",
    name: "Premium",
    subtitle: "Complete Care Package",
    price: "$899",
    period: "/month",
    features: [
      "Unlimited fixes and changes",
      "Custom feature roadmap for your growth",
      "Weekly speed and performance updates",
      "Round-the-clock help (2-hour response)",
      "Advanced monthly security reviews",
      "Your own personal tech manager",
      "First-in-line for feature requests",
      "Detailed site health reports",
      "Long-term growth planning",
    ],
    cta: "Get Started",
  },
];

const PlanGrid = ({ plans }: { plans: Plan[] }) => (
  <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
    {plans.map((plan) => (
      <Card
        key={plan.id}
        className={`glass-card h-full flex flex-col ${
          plan.highlight ? "ring-2 ring-primary/50 shadow-lg shadow-primary/10" : ""
        }`}
      >
        <CardHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
          <div className="flex items-start justify-between">
            <div>
              {plan.subtitle && (
                <CardDescription className="mb-1 font-medium text-primary text-xs">
                  {plan.subtitle}
                </CardDescription>
              )}
              <CardTitle className="text-lg sm:text-xl font-bold">{plan.name}</CardTitle>
            </div>
            {plan.badge && (
              <Badge className="bg-primary text-primary-foreground text-[10px] px-2">{plan.badge}</Badge>
            )}
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold">{plan.price}</span>
            <span className="text-xs sm:text-sm text-muted-foreground ml-1">{plan.period}</span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col px-5 sm:px-6 pb-5 sm:pb-6">
          <ul className="space-y-2.5 mb-6 flex-grow">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-foreground/80 text-[13px] leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
          <Button
            className={`w-full font-medium h-10 ${
              plan.highlight ? "professional-gradient text-white shadow-lg hover:shadow-xl" : ""
            }`}
            variant={plan.highlight ? "default" : "outline"}
            asChild
          >
            <a href="#contact">{plan.cta}</a>
          </Button>
        </CardContent>
      </Card>
    ))}
  </div>
);

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 sm:py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Investment</span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3 mb-4 solana-gradient-text">
            Pricing
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparent, value-focused plans. Rates can vary with scope and timeline.
          </p>
        </div>

        <Tabs defaultValue="web" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="web">Web Apps</TabsTrigger>
              <TabsTrigger value="mobile">Mobile Apps</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="web">
            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-bold text-center mb-4">New Development</h3>
                <PlanGrid plans={webNew} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-center mb-4">Maintenance</h3>
                <PlanGrid plans={webMaintenance} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mobile">
            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-bold text-center mb-4">New Development</h3>
                <PlanGrid plans={mobileNew} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-center mb-4">Maintenance</h3>
                <PlanGrid plans={mobileMaintenance} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Pricing;
