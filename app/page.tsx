"use client"

import { GovernmentHeader } from "@/components/government-header"
import { GovernmentFooter } from "@/components/government-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Map,
  FileText,
  Brain,
  Users,
  TrendingUp,
  Shield,
  Database,
  ArrowRight,
  Sparkles,
  Target,
  Award,
  Globe,
  Zap,
  TreePine,
  Scale,
  BookOpen,
} from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <GovernmentHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-screen flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-secondary/5 to-accent/10"></div>
            {/* Static, subtle background elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-40 right-32 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-secondary/10 rounded-full blur-xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 animate-fade-in">
                  <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {t("governmentInitiative")}
                  </Badge>
                  <h1 className="text-6xl md:text-8xl font-bold text-white animate-slide-up">
                    {t("heroTitle")}
                    <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      {t("heroSubtitle")}
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed animate-slide-up">
                    {t("heroDescription")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 pt-6 animate-slide-up">
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      asChild
                    >
                      <a href="/dashboard" className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        {t("accessDashboard")}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      {t("viewDocuments")}
                    </Button>
                  </div>
                </div>

                {/* Refined and grounded UI Mockup */}
                <div className="relative animate-fade-in">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 bg-white/20 rounded w-1/2"></div>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Simplified Bar Chart */}
                        <div className="h-24 bg-primary/20 rounded-lg p-2 flex items-end gap-1 border border-white/10">
                            <div className="w-1/4 h-1/3 bg-primary/50 rounded-sm"></div>
                            <div className="w-1/4 h-2/3 bg-primary/50 rounded-sm"></div>
                            <div className="w-1/4 h-1/2 bg-primary/50 rounded-sm"></div>
                            <div className="w-1/4 h-3/4 bg-primary/50 rounded-sm"></div>
                        </div>
                        {/* Simplified Map */}
                        <div className="h-24 bg-secondary/20 rounded-lg flex items-center justify-center border border-white/10">
                          <Globe className="h-12 w-12 text-secondary/50" />
                        </div>
                      </div>
                      <div className="h-8 bg-white/10 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-32 bg-background relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-20 animate-fade-in">
              <Badge variant="outline" className="mb-6 text-base px-4 py-2">
                <Target className="h-4 w-4 mr-2" />
                {t("keyFeatures")}
              </Badge>
              <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8">{t("featuresTitle")}</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t("featuresDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-scale-in border-primary/10 hover:border-primary/30 group">
                <CardHeader className="pb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <BarChart3 className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{t("analyticsDashboard")}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{t("analyticsDashboardDesc")}</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-scale-in border-secondary/10 hover:border-secondary/30 group">
                <CardHeader className="pb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Map className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{t("webgisMapping")}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{t("webgisMappingDesc")}</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-scale-in border-accent/10 hover:border-accent/30 group">
                <CardHeader className="pb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <FileText className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-xl">{t("claimsExplorer")}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{t("claimsExplorerDesc")}</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-scale-in border-primary/10 hover:border-primary/30 group">
                <CardHeader className="pb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Brain className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{t("aiTools")}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{t("aiToolsDesc")}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* About FRA Section */}
        <section className="py-32 bg-gradient-to-r from-primary/5 to-secondary/5 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-6 text-base px-4 py-2">
                  <Scale className="h-4 w-4 mr-2" />
                  {t("fra")}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">{t("fraFullName")}</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <p className="text-lg text-muted-foreground leading-relaxed">{t("fraDescription")}</p>

                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <TreePine className="h-6 w-6 text-primary" />
                      {t("fraObjectives")}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                        <p className="text-muted-foreground leading-relaxed">{t("objective1")}</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                        <p className="text-muted-foreground leading-relaxed">{t("objective2")}</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                        <p className="text-muted-foreground leading-relaxed">{t("objective3")}</p>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-2xl border border-primary/10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">2006</h4>
                        <p className="text-sm text-muted-foreground">{t("actYear")}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-primary/5 rounded-xl">
                        <div className="text-2xl font-bold text-primary">15,000+</div>
                        <div className="text-sm text-muted-foreground">{t("totalClaims")}</div>
                      </div>
                      <div className="text-center p-4 bg-secondary/5 rounded-xl">
                        <div className="text-2xl font-bold text-secondary">65.7%</div>
                        <div className="text-sm text-muted-foreground">{t("approvalRate")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-6 text-base px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                {t("achievements")}
              </Badge>
              <h2 className="text-5xl font-bold text-foreground mb-6">{t("impressiveStats")}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center animate-scale-in group">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-110">
                  <Users className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="text-5xl font-bold text-foreground mb-4">15,000+</div>
                <div className="text-muted-foreground text-lg">{t("totalClaims")}</div>
              </div>

              <div className="text-center animate-scale-in group">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-110">
                  <TrendingUp className="h-12 w-12 text-secondary-foreground" />
                </div>
                <div className="text-5xl font-bold text-foreground mb-4">65.7%</div>
                <div className="text-muted-foreground text-lg">{t("approvalRate")}</div>
              </div>

              <div className="text-center animate-scale-in group">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-110">
                  <Shield className="h-12 w-12 text-accent-foreground" />
                </div>
                <div className="text-5xl font-bold text-foreground mb-4">100%</div>
                <div className="text-muted-foreground text-lg">{t("secureCompliant")}</div>
              </div>

              <div className="text-center animate-scale-in group">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-110">
                  <Database className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="text-5xl font-bold text-foreground mb-4">6</div>
                <div className="text-muted-foreground text-lg">{t("integratedDatasets")}</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
          <div className="container mx-auto px-4 relative">
            <Card className="relative overflow-hidden bg-white border-primary/20 shadow-2xl animate-fade-in max-w-5xl mx-auto">
              <CardContent className="p-16 text-center relative">
                <div className="flex justify-center mb-8">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
                    <Zap className="h-10 w-10 text-primary-foreground" />
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">{t("readyToStart")}</h2>
                <p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
                  {t("ctaDescription")}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    asChild
                  >
                    <a href="/dashboard" className="flex items-center gap-3">
                      <Globe className="h-6 w-6" />
                      {t("launchDashboard")}
                      <ArrowRight className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-10 py-6 hover:bg-primary/5 transition-all duration-300 hover:scale-105 border-2"
                  >
                    <FileText className="h-6 w-6 mr-3" />
                    {t("viewUserGuide")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <GovernmentFooter />
    </div>
  )
}