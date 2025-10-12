import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 solana-gradient-text">Pricing</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Transparent, value-focused plans. Rates can vary with scope and timeline.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative glass-card border-0 animated-border ${plan.highlight ? "ring-1 ring-purple-400/50 dark:ring-purple-600/40" : ""}`}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full solana-gradient text-white" asChild>
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
