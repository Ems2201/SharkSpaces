import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Fish, Waves, Droplet, Trash2 } from "lucide-react";
import oceanMapBg from "@/assets/ocean-map-bg.png";

interface Species {
  type: string;
  commonName: string;
  scientificName: string;
  role: 'producer' | 'primary-consumer' | 'secondary-consumer' | 'apex-predator' | 'decomposer';
  foodSources: string[];
  predators: string[];
  growthRate: number; // 1-10 scale
  reproductionRate: number; // 1-10 scale
  environmentalImpact: string;
  icon: string;
}

interface Element {
  id: string;
  type: string;
  x: number;
  y: number;
  icon: string;
  species: Species;
}

const EcosystemSimulator = () => {
  const { t } = useTranslation();
  const [elements, setElements] = useState<Element[]>([]);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [ecosystemHealth, setEcosystemHealth] = useState(50);

  const marineSpecies: Species[] = [
    // Producers
    { type: 'phytoplankton', commonName: 'Phytoplankton', scientificName: 'Various microalgae', role: 'producer', foodSources: [], predators: ['krill', 'copepod', 'anchovy', 'jellyfish'], growthRate: 10, reproductionRate: 10, environmentalImpact: 'Produces 50% of Earth\'s oxygen', icon: '🦠' },
    { type: 'seagrass', commonName: 'Seagrass', scientificName: 'Posidonia oceanica', role: 'producer', foodSources: [], predators: ['sea-turtle', 'manatee'], growthRate: 5, reproductionRate: 3, environmentalImpact: 'Provides nursery habitat and stabilizes sediment', icon: '🌿' },
    { type: 'kelp', commonName: 'Giant Kelp', scientificName: 'Macrocystis pyrifera', role: 'producer', foodSources: [], predators: ['sea-urchin', 'fish'], growthRate: 9, reproductionRate: 7, environmentalImpact: 'Creates underwater forests providing shelter', icon: '🌱' },
    { type: 'coral', commonName: 'Coral Reef', scientificName: 'Acropora spp.', role: 'producer', foodSources: ['zooplankton'], predators: ['crown-starfish', 'parrotfish'], growthRate: 2, reproductionRate: 2, environmentalImpact: 'Builds reef structures supporting 25% of marine life', icon: '🪸' },
    { type: 'diatom', commonName: 'Diatoms', scientificName: 'Bacillariophyta', role: 'producer', foodSources: [], predators: ['copepod', 'krill'], growthRate: 10, reproductionRate: 10, environmentalImpact: 'Major oxygen producer and carbon sink', icon: '✨' },
    
    // Primary Consumers
    { type: 'krill', commonName: 'Antarctic Krill', scientificName: 'Euphausia superba', role: 'primary-consumer', foodSources: ['phytoplankton', 'diatom'], predators: ['whale', 'penguin', 'seal', 'fish'], growthRate: 8, reproductionRate: 9, environmentalImpact: 'Key species in Antarctic food web', icon: '🦐' },
    { type: 'copepod', commonName: 'Copepods', scientificName: 'Calanus spp.', role: 'primary-consumer', foodSources: ['phytoplankton', 'diatom'], predators: ['anchovy', 'herring', 'jellyfish'], growthRate: 9, reproductionRate: 10, environmentalImpact: 'Most abundant animal group on Earth', icon: '🔬' },
    { type: 'sea-urchin', commonName: 'Sea Urchin', scientificName: 'Strongylocentrotus spp.', role: 'primary-consumer', foodSources: ['kelp', 'seagrass'], predators: ['sea-otter', 'starfish'], growthRate: 4, reproductionRate: 5, environmentalImpact: 'Controls kelp forest growth', icon: '🦔' },
    { type: 'zooplankton', commonName: 'Zooplankton', scientificName: 'Various species', role: 'primary-consumer', foodSources: ['phytoplankton'], predators: ['jellyfish', 'fish', 'whale'], growthRate: 9, reproductionRate: 10, environmentalImpact: 'Links primary production to higher trophic levels', icon: '🌊' },
    { type: 'sea-cucumber', commonName: 'Sea Cucumber', scientificName: 'Holothuroidea', role: 'decomposer', foodSources: ['detritus', 'organic-matter'], predators: ['sea-star', 'crab'], growthRate: 3, reproductionRate: 4, environmentalImpact: 'Recycles nutrients on ocean floor', icon: '🥒' },
    
    // Secondary Consumers - Small Fish
    { type: 'anchovy', commonName: 'Anchovy', scientificName: 'Engraulis encrasicolus', role: 'secondary-consumer', foodSources: ['phytoplankton', 'copepod', 'zooplankton'], predators: ['tuna', 'dolphin', 'shark', 'seabird'], growthRate: 7, reproductionRate: 8, environmentalImpact: 'Crucial forage fish species', icon: '🐟' },
    { type: 'herring', commonName: 'Herring', scientificName: 'Clupea harengus', role: 'secondary-consumer', foodSources: ['copepod', 'krill', 'zooplankton'], predators: ['cod', 'salmon', 'whale', 'seal'], growthRate: 6, reproductionRate: 7, environmentalImpact: 'Important commercial and ecological species', icon: '🐠' },
    { type: 'sardine', commonName: 'Sardine', scientificName: 'Sardina pilchardus', role: 'secondary-consumer', foodSources: ['phytoplankton', 'copepod'], predators: ['tuna', 'dolphin', 'shark'], growthRate: 7, reproductionRate: 8, environmentalImpact: 'Key prey species in upwelling zones', icon: '🐟' },
    { type: 'clownfish', commonName: 'Clownfish', scientificName: 'Amphiprion ocellaris', role: 'secondary-consumer', foodSources: ['zooplankton', 'algae'], predators: ['grouper', 'snapper'], growthRate: 5, reproductionRate: 6, environmentalImpact: 'Symbiotic with sea anemones', icon: '🐠' },
    
    // Medium Fish
    { type: 'mackerel', commonName: 'Atlantic Mackerel', scientificName: 'Scomber scombrus', role: 'secondary-consumer', foodSources: ['anchovy', 'copepod', 'krill'], predators: ['tuna', 'shark', 'dolphin'], growthRate: 6, reproductionRate: 7, environmentalImpact: 'Important pelagic predator', icon: '🐟' },
    { type: 'cod', commonName: 'Atlantic Cod', scientificName: 'Gadus morhua', role: 'secondary-consumer', foodSources: ['herring', 'shrimp', 'crab'], predators: ['shark', 'seal'], growthRate: 5, reproductionRate: 6, environmentalImpact: 'Historically abundant top predator', icon: '🐠' },
    { type: 'salmon', commonName: 'Pacific Salmon', scientificName: 'Oncorhynchus spp.', role: 'secondary-consumer', foodSources: ['krill', 'herring', 'squid'], predators: ['orca', 'shark', 'bear'], growthRate: 6, reproductionRate: 7, environmentalImpact: 'Transfers nutrients from ocean to rivers', icon: '🐟' },
    { type: 'parrotfish', commonName: 'Parrotfish', scientificName: 'Scaridae', role: 'secondary-consumer', foodSources: ['coral', 'algae'], predators: ['shark', 'grouper'], growthRate: 4, reproductionRate: 5, environmentalImpact: 'Creates sand through coral consumption', icon: '🐠' },
    
    // Large Fish & Predators
    { type: 'tuna', commonName: 'Bluefin Tuna', scientificName: 'Thunnus thynnus', role: 'apex-predator', foodSources: ['anchovy', 'sardine', 'mackerel', 'squid'], predators: ['shark', 'orca'], growthRate: 5, reproductionRate: 4, environmentalImpact: 'Top oceanic predator', icon: '🐟' },
    { type: 'swordfish', commonName: 'Swordfish', scientificName: 'Xiphias gladius', role: 'apex-predator', foodSources: ['squid', 'mackerel', 'tuna'], predators: ['shark', 'orca'], growthRate: 5, reproductionRate: 4, environmentalImpact: 'Deep-diving apex predator', icon: '🗡️' },
    { type: 'grouper', commonName: 'Giant Grouper', scientificName: 'Epinephelus lanceolatus', role: 'secondary-consumer', foodSources: ['fish', 'crab', 'lobster'], predators: ['shark'], growthRate: 3, reproductionRate: 3, environmentalImpact: 'Reef ecosystem predator', icon: '🐠' },
    { type: 'barracuda', commonName: 'Great Barracuda', scientificName: 'Sphyraena barracuda', role: 'apex-predator', foodSources: ['fish', 'squid'], predators: ['shark'], growthRate: 5, reproductionRate: 5, environmentalImpact: 'Fast reef predator', icon: '🐟' },
    
    // Sharks
    { type: 'great-white', commonName: 'Great White Shark', scientificName: 'Carcharodon carcharias', role: 'apex-predator', foodSources: ['seal', 'tuna', 'dolphin', 'fish'], predators: [], growthRate: 2, reproductionRate: 1, environmentalImpact: 'Top apex predator maintaining ecosystem balance', icon: '🦈' },
    { type: 'hammerhead', commonName: 'Hammerhead Shark', scientificName: 'Sphyrna mokarran', role: 'apex-predator', foodSources: ['stingray', 'fish', 'squid'], predators: [], growthRate: 3, reproductionRate: 2, environmentalImpact: 'Controls ray populations', icon: '🦈' },
    { type: 'whale-shark', commonName: 'Whale Shark', scientificName: 'Rhincodon typus', role: 'secondary-consumer', foodSources: ['krill', 'plankton', 'small-fish'], predators: [], growthRate: 2, reproductionRate: 1, environmentalImpact: 'Largest filter feeder', icon: '🦈' },
    { type: 'tiger-shark', commonName: 'Tiger Shark', scientificName: 'Galeocerdo cuvier', role: 'apex-predator', foodSources: ['turtle', 'seal', 'fish', 'dolphin'], predators: [], growthRate: 3, reproductionRate: 2, environmentalImpact: 'Generalist predator cleaning up weak/sick animals', icon: '🦈' },
    { type: 'reef-shark', commonName: 'Reef Shark', scientificName: 'Carcharhinus melanopterus', role: 'apex-predator', foodSources: ['fish', 'octopus', 'crab'], predators: [], growthRate: 4, reproductionRate: 3, environmentalImpact: 'Maintains reef fish populations', icon: '🦈' },
    
    // Marine Mammals
    { type: 'blue-whale', commonName: 'Blue Whale', scientificName: 'Balaenoptera musculus', role: 'secondary-consumer', foodSources: ['krill'], predators: [], growthRate: 1, reproductionRate: 1, environmentalImpact: 'Largest animal, distributes nutrients through feces', icon: '🐋' },
    { type: 'humpback-whale', commonName: 'Humpback Whale', scientificName: 'Megaptera novaeangliae', role: 'secondary-consumer', foodSources: ['krill', 'herring', 'anchovy'], predators: [], growthRate: 2, reproductionRate: 2, environmentalImpact: 'Nutrient pump through vertical migration', icon: '🐋' },
    { type: 'orca', commonName: 'Orca', scientificName: 'Orcinus orca', role: 'apex-predator', foodSources: ['seal', 'whale', 'shark', 'fish'], predators: [], growthRate: 2, reproductionRate: 2, environmentalImpact: 'Apex predator controlling multiple species', icon: '🐋' },
    { type: 'dolphin', commonName: 'Bottlenose Dolphin', scientificName: 'Tursiops truncatus', role: 'apex-predator', foodSources: ['fish', 'squid', 'shrimp'], predators: ['shark', 'orca'], growthRate: 3, reproductionRate: 3, environmentalImpact: 'Intelligent predator maintaining fish populations', icon: '🐬' },
    { type: 'seal', commonName: 'Harbor Seal', scientificName: 'Phoca vitulina', role: 'secondary-consumer', foodSources: ['fish', 'squid', 'octopus'], predators: ['shark', 'orca'], growthRate: 4, reproductionRate: 4, environmentalImpact: 'Coastal predator linking ocean to land', icon: '🦭' },
    { type: 'sea-otter', commonName: 'Sea Otter', scientificName: 'Enhydra lutris', role: 'secondary-consumer', foodSources: ['sea-urchin', 'crab', 'shellfish'], predators: ['shark', 'orca'], growthRate: 3, reproductionRate: 3, environmentalImpact: 'Keystone species controlling urchin populations', icon: '🦦' },
    { type: 'walrus', commonName: 'Walrus', scientificName: 'Odobenus rosmarus', role: 'secondary-consumer', foodSources: ['clam', 'shrimp', 'crab'], predators: ['orca'], growthRate: 2, reproductionRate: 2, environmentalImpact: 'Benthic forager in Arctic waters', icon: '🦭' },
    
    // Sea Birds
    { type: 'albatross', commonName: 'Wandering Albatross', scientificName: 'Diomedea exulans', role: 'secondary-consumer', foodSources: ['squid', 'fish', 'krill'], predators: [], growthRate: 1, reproductionRate: 1, environmentalImpact: 'Long-distance nutrient transporter', icon: '🕊️' },
    { type: 'penguin', commonName: 'Emperor Penguin', scientificName: 'Aptenodytes forsteri', role: 'secondary-consumer', foodSources: ['krill', 'fish', 'squid'], predators: ['seal', 'shark', 'orca'], growthRate: 2, reproductionRate: 2, environmentalImpact: 'Antarctic ecosystem indicator species', icon: '🐧' },
    { type: 'pelican', commonName: 'Brown Pelican', scientificName: 'Pelecanus occidentalis', role: 'secondary-consumer', foodSources: ['anchovy', 'herring', 'fish'], predators: [], growthRate: 3, reproductionRate: 3, environmentalImpact: 'Coastal fish predator', icon: '🦩' },
    
    // Invertebrates
    { type: 'jellyfish', commonName: 'Moon Jellyfish', scientificName: 'Aurelia aurita', role: 'secondary-consumer', foodSources: ['zooplankton', 'copepod', 'fish-eggs'], predators: ['turtle', 'tuna'], growthRate: 8, reproductionRate: 9, environmentalImpact: 'Blooms indicate ecosystem changes', icon: '🪼' },
    { type: 'squid', commonName: 'Giant Squid', scientificName: 'Architeuthis dux', role: 'secondary-consumer', foodSources: ['fish', 'shrimp', 'small-squid'], predators: ['whale', 'shark'], growthRate: 6, reproductionRate: 7, environmentalImpact: 'Deep sea predator and whale prey', icon: '🦑' },
    { type: 'octopus', commonName: 'Giant Pacific Octopus', scientificName: 'Enteroctopus dofleini', role: 'secondary-consumer', foodSources: ['crab', 'shrimp', 'fish'], predators: ['shark', 'seal'], growthRate: 5, reproductionRate: 6, environmentalImpact: 'Intelligent predator with problem-solving abilities', icon: '🐙' },
    { type: 'crab', commonName: 'Dungeness Crab', scientificName: 'Metacarcinus magister', role: 'secondary-consumer', foodSources: ['clam', 'worm', 'detritus'], predators: ['octopus', 'fish', 'sea-otter'], growthRate: 5, reproductionRate: 6, environmentalImpact: 'Benthic scavenger and predator', icon: '🦀' },
    { type: 'lobster', commonName: 'American Lobster', scientificName: 'Homarus americanus', role: 'secondary-consumer', foodSources: ['fish', 'mussel', 'urchin'], predators: ['cod', 'octopus'], growthRate: 4, reproductionRate: 5, environmentalImpact: 'Reef scavenger', icon: '🦞' },
    { type: 'starfish', commonName: 'Sea Star', scientificName: 'Asteroidea', role: 'secondary-consumer', foodSources: ['mussel', 'clam', 'oyster'], predators: ['sea-otter'], growthRate: 4, reproductionRate: 5, environmentalImpact: 'Keystone predator in intertidal zones', icon: '⭐' },
    
    // Reptiles
    { type: 'sea-turtle', commonName: 'Green Sea Turtle', scientificName: 'Chelonia mydas', role: 'primary-consumer', foodSources: ['seagrass', 'algae', 'jellyfish'], predators: ['shark', 'orca'], growthRate: 2, reproductionRate: 2, environmentalImpact: 'Maintains seagrass beds through grazing', icon: '🐢' },
    { type: 'sea-snake', commonName: 'Yellow-bellied Sea Snake', scientificName: 'Hydrophis platurus', role: 'secondary-consumer', foodSources: ['fish', 'eel'], predators: ['shark', 'eagle'], growthRate: 4, reproductionRate: 4, environmentalImpact: 'Venomous marine predator', icon: '🐍' },
    
    // Deep Sea Species
    { type: 'anglerfish', commonName: 'Deep-sea Anglerfish', scientificName: 'Melanocetus johnsonii', role: 'secondary-consumer', foodSources: ['fish', 'shrimp'], predators: [], growthRate: 3, reproductionRate: 3, environmentalImpact: 'Deep-sea ambush predator', icon: '🐟' },
    { type: 'viperfish', commonName: 'Viperfish', scientificName: 'Chauliodus sloani', role: 'secondary-consumer', foodSources: ['fish', 'shrimp'], predators: ['tuna', 'shark'], growthRate: 4, reproductionRate: 4, environmentalImpact: 'Mesopelagic predator', icon: '🐠' },
    { type: 'gulper-eel', commonName: 'Gulper Eel', scientificName: 'Eurypharynx pelecanoides', role: 'secondary-consumer', foodSources: ['fish', 'shrimp', 'squid'], predators: ['shark'], growthRate: 3, reproductionRate: 3, environmentalImpact: 'Deep-sea specialized predator', icon: '🐍' },
    
    // Decomposers & Cleaners
    { type: 'hagfish', commonName: 'Hagfish', scientificName: 'Myxini', role: 'decomposer', foodSources: ['dead-whale', 'carcass', 'worm'], predators: [], growthRate: 3, reproductionRate: 3, environmentalImpact: 'Cleans ocean floor of dead organisms', icon: '🪱' },
    { type: 'sea-worm', commonName: 'Polychaete Worm', scientificName: 'Polychaeta', role: 'decomposer', foodSources: ['detritus', 'bacteria'], predators: ['fish', 'crab'], growthRate: 7, reproductionRate: 8, environmentalImpact: 'Recycles organic matter in sediments', icon: '🪱' },
    { type: 'bacteria', commonName: 'Marine Bacteria', scientificName: 'Various species', role: 'decomposer', foodSources: ['dead-matter', 'waste'], predators: [], growthRate: 10, reproductionRate: 10, environmentalImpact: 'Breaks down organic matter and cycles nutrients', icon: '🦠' },
    
    // Environmental Stressors
    { type: 'pollution', commonName: 'Ocean Pollution', scientificName: 'Anthropogenic waste', role: 'decomposer', foodSources: [], predators: [], growthRate: 10, reproductionRate: 10, environmentalImpact: 'Harms all marine life, disrupts food chains', icon: '🗑️' },
    { type: 'plastic', commonName: 'Microplastics', scientificName: 'Synthetic polymers', role: 'decomposer', foodSources: [], predators: [], growthRate: 10, reproductionRate: 10, environmentalImpact: 'Accumulates in food chain, toxic to marine life', icon: '♻️' },
  ];

  // Organize species into categories
  const categories = [
    {
      name: t('simulator.categories.sharks'),
      species: marineSpecies.filter(s => ['great-white', 'hammerhead', 'whale-shark', 'tiger-shark', 'reef-shark'].includes(s.type))
    },
    {
      name: t('simulator.categories.marineMammals'),
      species: marineSpecies.filter(s => ['blue-whale', 'humpback-whale', 'orca', 'dolphin', 'seal', 'sea-otter', 'walrus'].includes(s.type))
    },
    {
      name: t('simulator.categories.fish'),
      species: marineSpecies.filter(s => ['anchovy', 'herring', 'sardine', 'clownfish', 'mackerel', 'cod', 'salmon', 'parrotfish', 'tuna', 'swordfish', 'grouper', 'barracuda', 'anglerfish', 'viperfish', 'gulper-eel'].includes(s.type))
    },
    {
      name: t('simulator.categories.invertebrates'),
      species: marineSpecies.filter(s => ['krill', 'copepod', 'sea-urchin', 'zooplankton', 'sea-cucumber', 'jellyfish', 'squid', 'octopus', 'crab', 'lobster', 'starfish'].includes(s.type))
    },
    {
      name: t('simulator.categories.reptilesAndBirds'),
      species: marineSpecies.filter(s => ['sea-turtle', 'sea-snake', 'albatross', 'penguin', 'pelican'].includes(s.type))
    },
    {
      name: t('simulator.categories.producers'),
      species: marineSpecies.filter(s => ['phytoplankton', 'seagrass', 'kelp', 'coral', 'diatom'].includes(s.type))
    },
    {
      name: t('simulator.categories.decomposers'),
      species: marineSpecies.filter(s => ['hagfish', 'sea-worm', 'bacteria'].includes(s.type))
    },
    {
      name: t('simulator.categories.pollutants'),
      species: marineSpecies.filter(s => ['pollution', 'plastic'].includes(s.type))
    }
  ];

  const availableElements = marineSpecies.map(species => ({
    type: species.type,
    icon: species.icon,
    label: t(`species:${species.type}`, { defaultValue: species.commonName }),
    species: species
  }));

  const calculateHealth = (newElements: Element[]) => {
    const roleCounts = {
      producer: newElements.filter(e => e.species.role === 'producer').length,
      'primary-consumer': newElements.filter(e => e.species.role === 'primary-consumer').length,
      'secondary-consumer': newElements.filter(e => e.species.role === 'secondary-consumer').length,
      'apex-predator': newElements.filter(e => e.species.role === 'apex-predator').length,
      decomposer: newElements.filter(e => e.species.role === 'decomposer').length,
    };

    const pollutionCount = newElements.filter(e => e.type === 'pollution' || e.type === 'plastic').length;
    
    let health = 50;

    // Balanced ecosystem needs all trophic levels
    if (roleCounts.producer >= 3 && roleCounts.producer <= 8) health += 25;
    if (roleCounts['primary-consumer'] >= 2 && roleCounts['primary-consumer'] <= 6) health += 20;
    if (roleCounts['secondary-consumer'] >= 2 && roleCounts['secondary-consumer'] <= 5) health += 15;
    if (roleCounts['apex-predator'] >= 1 && roleCounts['apex-predator'] <= 3) health += 10;
    if (roleCounts.decomposer >= 1 && roleCounts.decomposer <= 3) health += 5;

    // Negative factors
    if (pollutionCount > 0) health -= pollutionCount * 20;
    if (roleCounts.producer === 0) health -= 30;
    if (roleCounts['apex-predator'] > 5) health -= 20;
    if (roleCounts['secondary-consumer'] > 8) health -= 15;

    return Math.max(0, Math.min(100, health));
  };

  const handleDragStart = (elementType: string) => {
    setDraggedElement(elementType);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedElement) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const species = availableElements.find(el => el.type === draggedElement)?.species;
    if (!species) return;

    const newElement: Element = {
      id: `${draggedElement}-${Date.now()}`,
      type: draggedElement,
      x,
      y,
      icon: species.icon,
      species: species,
    };

    const newElements = [...elements, newElement];
    setElements(newElements);
    setEcosystemHealth(calculateHealth(newElements));
    setDraggedElement(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resetSimulation = () => {
    setElements([]);
    setEcosystemHealth(50);
  };

  const getHealthColor = () => {
    if (ecosystemHealth >= 70) return 'bg-green-500';
    if (ecosystemHealth >= 40) return 'bg-yellow-500';
    return 'bg-destructive';
  };

  const getHealthMessage = () => {
    if (ecosystemHealth >= 80) return t('simulator.health.thriving');
    if (ecosystemHealth >= 60) return t('simulator.health.healthy');
    if (ecosystemHealth >= 40) return t('simulator.health.moderate');
    if (ecosystemHealth >= 20) return t('simulator.health.risk');
    return t('simulator.health.collapse');
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-2 animate-slide-in">
          {t('simulator.title')} 🐠
        </h1>
        <p className="text-foreground/80 mb-8 text-lg">
          {t('simulator.description')}
        </p>

        {/* Health Status Bar */}
        <Card className="p-6 mb-6 bg-card border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl">{t('simulator.ecosystemHealth')}</h3>
            <Button 
              onClick={resetSimulation}
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('simulator.reset')}
            </Button>
          </div>
          
          <div className="relative w-full h-8 bg-muted rounded-full overflow-hidden mb-3">
            <div 
              className={`h-full ${getHealthColor()} transition-all duration-500 ease-out`}
              style={{ width: `${ecosystemHealth}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-sm text-foreground/90">{ecosystemHealth}%</span>
            </div>
          </div>
          
          <p className="text-sm text-foreground/80 text-center font-medium">
            {getHealthMessage()}
          </p>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Available Elements */}
          <Card className="p-6 bg-card border-2 border-border lg:col-span-1">
            <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
              <Waves className="w-5 h-5" />
              {t('simulator.elements')}
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <h4 className="font-semibold text-sm text-primary/80 sticky top-0 bg-card py-1 z-10">
                    {category.name}
                  </h4>
                  <div className="space-y-2">
                    {category.species.map((species) => (
                      <div
                        key={species.type}
                        draggable
                        onDragStart={() => handleDragStart(species.type)}
                        className="p-3 bg-secondary rounded-lg cursor-move border-2 border-transparent hover:border-primary transition-smooth text-center"
                      >
                        <div className="text-3xl mb-1">{species.icon}</div>
                        <p className="text-xs font-medium">{t(`species:${species.type}`, { defaultValue: species.commonName })}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Ocean Drop Zone */}
          <Card className="lg:col-span-3 border-2 border-dashed border-primary/40 hover:border-primary transition-smooth">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="relative h-[800px] rounded-lg overflow-hidden bg-gradient-to-b from-blue-900/20 to-blue-950/40"
              style={{
                backgroundImage: `url(${oceanMapBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              
              {elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8 bg-card/80 backdrop-blur rounded-lg border-2 border-dashed border-primary/60">
                    <Droplet className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
                    <p className="text-foreground/70 text-lg">
                      {t('simulator.instruction1')}
                    </p>
                  </div>
                </div>
              )}

              {/* Placed Elements */}
              {elements.map((element) => (
                <div
                  key={element.id}
                  className="absolute transition-transform hover:scale-125 cursor-pointer"
                  style={{
                    left: `${element.x}%`,
                    top: `${element.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => {
                    const newElements = elements.filter(e => e.id !== element.id);
                    setElements(newElements);
                    setEcosystemHealth(calculateHealth(newElements));
                  }}
                >
                  <div className="text-5xl animate-float drop-shadow-lg">
                    {element.icon}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Rules Guide */}
        <Card className="mt-6 p-6 bg-nasa-dark-blue border-2 border-primary/40">
          <h3 className="font-bold text-lg mb-4 text-primary">{t('simulator.instructions')}</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-foreground/90">• {t('simulator.instruction1')}</p>
              <p className="text-foreground/90">• {t('simulator.instruction2')}</p>
            </div>
            <div className="space-y-2">
              <p className="text-foreground/90">• {t('simulator.instruction3')}</p>
              <p className="text-foreground/90">• {t('simulator.instruction4')}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EcosystemSimulator;
