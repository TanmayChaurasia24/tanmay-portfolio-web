import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    id: "web-new",
    name: "New Web Development",
    price: "₹50,000+",
    period: "project",
    highlight: true,
    features: [
      "Modern, fast, responsive UI",
      "SEO-friendly, optimized build",
      "Integrations (auth, CMS, payments)",
      "Deployment & handoff"
    ],
    cta: "Start Web Project",
  },
  {
    id: "web-maintenance",
    name: "Web Maintenance",
    price: "₹10,000/mo",
    period: "monthly",
    highlight: false,
    features: [
      "Bug fixes & updates",
      "Performance monitoring",
      "Content updates",
      "Small feature tweaks"
    ],
    cta: "Maintain Website",
  },
  {
    id: "mobile-new",
    name: "New Mobile Development",
    price: "₹80,000+",
    period: "project",
    highlight: true,
    features: [
      "iOS & Android (React Native)",
      "Beautiful, animated UI",
      "API integration & auth",
      "Play Store/App Store handoff"
    ],
    cta: "Start Mobile App",
  },
  {
    id: "mobile-maintenance",
    name: "Mobile Maintenance",
    price: "₹15,000/mo",
    period: "monthly",
    highlight: false,
    features: [
      "Bug fixes & patches",
      "OS compatibility updates",
      "Analytics & crash monitoring",
      "Minor features & UI tweaks"
    ],
    cta: "Maintain Mobile App",
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Investment</span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-4 solana-gradient-text">
            Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparent, value-focused plans. Rates can vary with scope and timeline.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`glass-card h-full flex flex-col ${
                plan.highlight 
                  ? "ring-2 ring-primary/50 shadow-lg shadow-primary/20" 
                  : ""
              }`}
            >
              <CardHeader>
                {plan.highlight && (
                  <div className="mb-2">
                    <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                  </div>
                )}
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mt-3">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.highlight 
                      ? "professional-gradient text-white shadow-lg hover:shadow-xl" 
                      : ""
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
      </div>
    </section>
  );
};

export default Pricing;
