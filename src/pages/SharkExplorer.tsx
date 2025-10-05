import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, X, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import oceanPinsMap from "@/assets/world-map.png";
import { LanguageSelector } from "@/components/LanguageSelector";
import { text } from "stream/consumers";

const SharkExplorer = () => {
  const { t, i18n } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [oceanPoints, setOceanPoints] = useState<any[]>([]);
  const { toast } = useToast();

  // 🔁 Carregar oceanPoints do idioma atual
  // 🔁 Carregar oceanPoints + links do idioma atual
  useEffect(() => {
    const loadData = async () => {
      try {
        const [pointsRes, linksRes] = await Promise.all([
          fetch(`/locales/${i18n.language}/oceanPoints.json`),
          fetch(`/data/oceanLinks.json`),
        ]);

        const pointsData = await pointsRes.json();
        const linksData = await linksRes.json();

        const combined = (pointsData.points || []).map((p: any) => ({
          ...p,
          links: linksData.links[p.id] || [],
        }));

        setOceanPoints(combined);
      } catch (error) {
        console.error("Erro carregando oceanPoints e links:", error);
        setOceanPoints([]);
      }
    };

    loadData();
  }, [i18n.language]);

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) {
      toast({
        title: t("sharkExplorer.emptyQuestion"),
        description: t("sharkExplorer.emptyQuestionDesc"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAiResponse("");

    try {
      const { data, error } = await supabase.functions.invoke("ocean-ai-chat", {
        body: { question: aiQuery },
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: t("sharkExplorer.error"),
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setAiResponse(data.answer);
    } catch (error) {
      console.error("Error calling AI:", error);
      toast({
        title: t("sharkExplorer.error"),
        description: t("sharkExplorer.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${oceanPinsMap})`,
        height: "1000px",
        backgroundSize: "contain",
      }}
    >
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative min-h-screen flex">
        {/* Mapa */}
        <div className="flex-1 relative p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-2">
              {t("sharkExplorer.title")}
            </h1>
            <p className="text-foreground/80 mb-8 text-lg">
              {t("sharkExplorer.subtitle")}
            </p>

            <div className="flex-1 relative">
              {oceanPoints.map((point) => (
                <button
                  key={point.id}
                  onClick={() => setSelectedRegion(point.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-white bg-red-500 shadow-md hover:scale-110 hover:z-20 transition-all duration-200 ${
                    selectedRegion === point.id ? "ring-2 ring-yellow-400" : ""
                  }`}
                  style={{
                    top: point.top,
                    left: point.left,
                    width: "14px",
                    height: "14px",
                  }}
                  title={point.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar de informações */}
        {selectedRegion && (
          <div
            className="absolute right-0 top-0 h-full bg-card/95 backdrop-blur-md border-l-2 border-primary/20 p-6 flex flex-col w-[360px] transition-transform duration-300 z-40"
            style={{
              width: "360px",
              height: "550px",
              position: "absolute",
              top: 250,
              right: 1100,
              borderRadius: 20,
            }}
          >
            {oceanPoints
              .filter((p) => p.id === selectedRegion)
              .map((point) => (
                <Card
                  key={point.id}
                  className="p-6 bg-card/95 border-primary/30 flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-primary">
                      {point.name}
                    </h3>
                    <button
                      onClick={() => setSelectedRegion(null)}
                      className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Lat:</span>
                      <div className="font-semibold">{point.lat}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lon:</span>
                      <div className="font-semibold">{point.lon}</div>
                    </div>
                  </div>

                  <p className="text-foreground text-sm mb-2">
                    <strong>Characteristics: </strong>
                    {point.info}
                  </p>
                  <p className="text-sm">
                    <strong>Species:</strong> {point.species.join(", ")}
                  </p>
                  <p className="text-sm mt-2">
                    <strong>Measurements:</strong>{" "}
                    {point.measurements.join(", ")}
                  </p>

                  <div
                    className="mt-3 text-sm text-blue-400 underline flex flex-col gap-2"
                    style={{ textDecoration: "none" }}
                  >
                    {point.links.length > 0 ? (
                      point.links.map((link: string, index: number) => (
                        <a
                          style={{ textDecoration: "none" }}
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Reference:
                        </a>
                      ))
                    ) : (
                      <span className="text-muted-foreground">
                        No links available
                      </span>
                    )}
                  </div>
                </Card>
              ))}
          </div>
        )}

        {/* Botão IA */}
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed right-4 top-24 z-50 bg-primary hover:bg-primary/90"
          size="icon"
        >
          <Sparkles className="h-5 w-5" />
        </Button>

        {/* Caixa da IA */}
        <div
          className={`fixed right-0 top-0 h-full bg-card/95 backdrop-blur-md border-l-2 border-primary/20 p-6 flex flex-col transition-transform duration-300 z-30 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ width: "334px" }}
        >
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <Search className="w-6 h-6" />
            {t("sharkExplorer.askAI")}
          </h2>

          <div className="flex flex-col gap-4 mb-4">
            <Input
              placeholder={t("sharkExplorer.placeholder")}
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !isLoading && handleAiQuery()
              }
              disabled={isLoading}
            />
            <Button
              onClick={handleAiQuery}
              disabled={isLoading}
              className="w-full bg-primary text-white hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("sharkExplorer.thinking")}
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  {t("sharkExplorer.askAI")}
                </>
              )}
            </Button>
          </div>

          {aiResponse ? (
            <Card className="p-4 bg-primary/10 border-primary/40 flex-1 overflow-auto">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {aiResponse}
              </p>
            </Card>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground text-sm">
              <p>{t("sharkExplorer.helpText")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharkExplorer;
