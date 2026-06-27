import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import portfolioData from "../data/portfolio.json";

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
  const { subtitle, title, description, web, mobile } = portfolioData.pricing;

  return (
    <section id="pricing" className="py-20 sm:py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">{subtitle}</span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3 mb-4 solana-gradient-text">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
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
                <PlanGrid plans={web.newDevelopment} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-center mb-4">Maintenance</h3>
                <PlanGrid plans={web.maintenance} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mobile">
            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-bold text-center mb-4">New Development</h3>
                <PlanGrid plans={mobile.newDevelopment} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-center mb-4">Maintenance</h3>
                <PlanGrid plans={mobile.maintenance} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Custom Solution Banner */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 via-background to-accent/10 border border-border rounded-2xl p-8 sm:p-10 text-center max-w-4xl mx-auto shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 solana-gradient-text">Need a Custom Solution?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            All pricing plans are fully flexible and can be tailored to your specific business goals, budget, and timeline. If you want a customized feature set or a unique package, let's connect and discuss!
          </p>
          <Button size="lg" className="professional-gradient text-white font-semibold px-8 h-12 text-base shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5" asChild>
            <a href="#contact">Let's Connect</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
