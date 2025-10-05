import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rocket, Waves, Brain, Activity } from "lucide-react";

const Index = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: "🗺️",
      title: t('home.features.explorer.title'),
      description: t('home.features.explorer.description'),
      link: "/explorer",
      color: "border-primary/40 hover:border-primary"
    },
    {
      icon: "📊",
      title: t('home.features.data.title'),
      description: t('home.features.data.description'),
      link: "/data",
      color: "border-primary/40 hover:border-primary"
    },
    {
      icon: "🌊",
      title: t('home.features.simulator.title'),
      description: t('home.features.simulator.description'),
      link: "/simulator",
      color: "border-primary/40 hover:border-primary"
    },
    {
      icon: "🧠",
      title: t('home.features.quiz.title'),
      description: t('home.features.quiz.description'),
      link: "/quiz",
      color: "border-primary/40 hover:border-primary"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-nasa-blue via-nasa-dark-blue to-background opacity-90" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(231, 244, 52, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(5, 73, 201, 0.2) 0%, transparent 50%)',
        }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-6 animate-float">
              <div className="text-8xl lg:text-9xl">🦈</div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-primary mb-6 animate-slide-in font-orbitron">
              SHARK SPACE
            </h1>
            
            <p className="text-xl lg:text-2xl text-foreground/90 mb-4 max-w-3xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            
            <p className="text-base lg:text-lg text-foreground/70 mb-10 max-w-2xl mx-auto">
              {t('home.hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/explorer">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 glow-yellow text-lg px-8 py-6"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  {t('home.hero.startExploring')}
                </Button>
              </Link>
              <Link to="/quiz">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  {t('home.hero.takeQuiz')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 font-orbitron">
              {t('home.featuresSection.title')}
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              {t('home.featuresSection.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card 
                  className={`p-6 h-full bg-card border-2 ${feature.color} transition-smooth hover:glow-yellow group cursor-pointer`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3 font-orbitron">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground/80">
                    {feature.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="py-16 lg:py-24 bg-nasa-dark-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4 font-orbitron">
              {t('home.satellites.title')}
            </h2>
            <p className="text-lg text-foreground/70">
              {t('home.satellites.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-card border-2 border-primary/40 hover:border-primary transition-smooth">
              <div className="flex items-center gap-3 mb-4">
                <Waves className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-bold text-primary font-orbitron">PACE</h3>
              </div>
              <p className="text-sm text-foreground/80 mb-3">
                {t('home.satellites.pace.description')}
              </p>
              <ul className="text-xs text-foreground/70 space-y-1">
                <li>• {t('home.satellites.pace.feature1')}</li>
                <li>• {t('home.satellites.pace.feature2')}</li>
                <li>• {t('home.satellites.pace.feature3')}</li>
              </ul>
            </Card>

            <Card className="p-6 bg-card border-2 border-primary/40 hover:border-primary transition-smooth">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-bold text-primary font-orbitron">MODIS-Aqua</h3>
              </div>
              <p className="text-sm text-foreground/80 mb-3">
                {t('home.satellites.modis.description')}
              </p>
              <ul className="text-xs text-foreground/70 space-y-1">
                <li>• {t('home.satellites.modis.feature1')}</li>
                <li>• {t('home.satellites.modis.feature2')}</li>
                <li>• {t('home.satellites.modis.feature3')}</li>
              </ul>
            </Card>

            <Card className="p-6 bg-card border-2 border-primary/40 hover:border-primary transition-smooth">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-bold text-primary font-orbitron">SWOT</h3>
              </div>
              <p className="text-sm text-foreground/80 mb-3">
                {t('home.satellites.swot.description')}
              </p>
              <ul className="text-xs text-foreground/70 space-y-1">
                <li>• {t('home.satellites.swot.feature1')}</li>
                <li>• {t('home.satellites.swot.feature2')}</li>
                <li>• {t('home.satellites.swot.feature3')}</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-10 bg-gradient-to-br from-nasa-blue to-nasa-dark-blue border-2 border-primary/40">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6 font-orbitron">
              {t('home.cta.title')}
            </h2>
            <p className="text-lg text-foreground/90 mb-8">
              {t('home.cta.description')}
            </p>
            <Link to="/explorer">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-yellow text-lg px-10 py-6"
              >
                {t('home.cta.button')}
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
