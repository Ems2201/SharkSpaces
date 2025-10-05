import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Map, BarChart3, Sprout, Brain, Home } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { relative } from "path";

const Navigation = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: "/", label: t('nav.home'), icon: Home },
    { path: "/explorer", label: t('nav.sharkExplorer'), icon: Map },
    { path: "/data", label: t('nav.sharkData'), icon: BarChart3 },
    { path: "/simulator", label: t('nav.ecosystemSim'), icon: Sprout },
    { path: "/quiz", label: t('nav.quiz'), icon: Brain },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-nasa-dark-blue border-b-2 border-primary/40 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95" style={{ position: "relative"}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="text-3xl transition-transform group-hover:scale-110">🦈</div>
            <span className="text-xl font-bold text-primary font-orbitron tracking-wider">
              SHARK SPACE
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`transition-smooth ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground glow-yellow"
                        : "text-foreground hover:bg-primary/20 hover:text-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <LanguageSelector />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex gap-1 items-center overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={`transition-smooth ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                </Link>
              );
            })}
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
