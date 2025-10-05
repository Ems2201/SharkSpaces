import { useTranslation } from "react-i18next";
import { Rocket, Github, Globe } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-nasa-dark-blue border-t-2 border-primary/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🦈</div>
              <span className="text-lg font-bold text-primary font-orbitron">SHARK SPACE</span>
            </div>
            <p className="text-sm text-foreground/70">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-3 font-orbitron">{t('footer.dataSources')}</h3>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>• PACE Satellite (2024)</li>
              <li>• MODIS-Aqua (2002-present)</li>
              <li>• SWOT Mission (2022-present)</li>
              <li>• NASA Space Apps Challenge</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-primary mb-3 font-orbitron">{t('footer.research')}</h3>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>• Braun et al. (2019) - {t('footer.eddyFeeding')}</li>
              <li>• Gaube et al. (2018) - {t('footer.gulfStream')}</li>
              <li>• {t('footer.realTimeData')}</li>
              <li>• {t('footer.predictiveModeling')}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/60">
            {t('footer.copyright')}
          </p>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://www.spaceappschallenge.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary transition-smooth"
            >
              <Rocket className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com/Ems2201" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary transition-smooth"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://nasa.gov" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary transition-smooth"
            >
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
