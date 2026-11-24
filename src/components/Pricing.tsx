import React, { useState } from "react";
import { Check, ArrowRight, Info, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import portfolioData from "../data/portfolio.json";

type Package = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  period: string;
  highlight?: boolean;
  badge?: string;
  projectType: string;
  features: string[];
  cta: string;
};

type PricingCategory = {
  id: string;
  name: string;
  packages: Package[];
};

const Pricing = () => {
  const pricingData = portfolioData.pricing;
  const categories: PricingCategory[] = pricingData.categories || [];
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]?.id || "web"
  );

  const handleSelectPackage = (projectType: string) => {
    window.dispatchEvent(
      new CustomEvent("select-project-type", { detail: { projectType } })
    );
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border/40">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider mb-3 px-3 py-1">
            {pricingData.subtitle}
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            {pricingData.title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {pricingData.description}
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <div className="flex justify-center mb-10 overflow-x-auto pb-2">
            <TabsList className="h-auto p-1 bg-muted/80 flex-wrap justify-center gap-1">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                >
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-0 focus-visible:outline-hidden">
              <div
                className={`grid gap-6 ${
                  cat.packages.length === 2
                    ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                    : "grid-cols-1 md:grid-cols-3"
                }`}
              >
                {cat.packages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`border relative flex flex-col justify-between rounded-xl overflow-hidden transition-all duration-200 ${
                      pkg.highlight
                        ? "border-primary/60 bg-card shadow-md ring-1 ring-primary/20"
                        : "border-border/70 bg-card/80 hover:border-border"
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                        {pkg.badge}
                      </div>
                    )}

                    <CardHeader className="p-6 pb-4">
                      <p className="text-xs font-medium text-primary mb-1">
                        {pkg.subtitle}
                      </p>
                      <CardTitle className="text-xl font-bold text-foreground">
                        {pkg.name}
                      </CardTitle>

                      <div className="mt-4 flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                          {pkg.price}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase font-medium">
                          {pkg.period}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-2 flex flex-col justify-between flex-grow">
                      <div className="mb-6">
                        <div className="h-px bg-border/50 my-3" />
                        <ul className="space-y-2.5">
                          {pkg.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/85"
                            >
                              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="leading-snug">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        variant={pkg.highlight ? "default" : "outline"}
                        onClick={() => handleSelectPackage(pkg.projectType)}
                        className="w-full text-xs font-semibold h-10 gap-1.5 shadow-2xs"
                      >
                        <span>{pkg.cta}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Transparent Disclaimer Box */}
        <div className="mt-12 p-4 sm:p-5 rounded-xl border border-border/60 bg-muted/30 flex items-start gap-3 max-w-4xl mx-auto">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground mb-0.5">Transparent Terms</p>
            <p>{pricingData.disclaimer}</p>
          </div>
        </div>

        {/* Custom Quote CTA Banner */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Looking for a specific multi-system integration or customized scope?
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSelectPackage("Other")}
            className="font-semibold text-xs h-9 px-5 gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Get a Custom Quote</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
