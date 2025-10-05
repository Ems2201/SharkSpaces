import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/LanguageSelector";
import worldMapBg from "@/assets/world-map-dark.png";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const SharkQuiz = () => {
  const { t, i18n } = useTranslation();
  
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [oxygenLevel, setOxygenLevel] = useState(100);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  // Get questions dynamically from i18n
  const getQuestionsForLevel = (level: number): Question[] => {
    try {
      const questionsData = i18n.t(`${level}`, { ns: 'questions', returnObjects: true });
      if (Array.isArray(questionsData) && questionsData.length > 0) {
        return questionsData as Question[];
      }
      // Fallback to level 1 if level doesn't exist
      const fallbackData = i18n.t('1', { ns: 'questions', returnObjects: true });
      if (Array.isArray(fallbackData)) {
        return fallbackData as Question[];
      }
      return [];
    } catch (error) {
      console.error('Error loading questions:', error);
      return [];
    }
  };

  useEffect(() => {
    if (difficulty !== null) {
      const levelQuestions = getQuestionsForLevel(difficulty);
      if (levelQuestions.length > 0) {
        setQuestions(levelQuestions);
      }
    }
  }, [difficulty, i18n.language]);

  const handleDifficultySelect = (level: number) => {
    setDifficulty(level);
    const levelQuestions = getQuestionsForLevel(level);
    setQuestions(levelQuestions);
    setOxygenLevel(Math.max(10, 110 - level * 10));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizComplete(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (showExplanation || questions.length === 0) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      setOxygenLevel(Math.min(100, oxygenLevel + 5));
    } else {
      setOxygenLevel(Math.max(0, oxygenLevel - 10));
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setDifficulty(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setOxygenLevel(100);
    setScore(0);
    setQuizComplete(false);
  };

  const getOxygenColor = () => {
    if (oxygenLevel <= 20) return 'bg-red-500';
    if (oxygenLevel <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getButtonClass = (index: number) => {
    if (!showExplanation) {
      return selectedAnswer === index
        ? 'bg-primary text-primary-foreground border-primary glow-yellow'
        : 'bg-card border-border hover:border-primary hover:glow-yellow';
    }

    if (index === questions[currentQuestion]?.correctAnswer) {
      return 'bg-green-500 border-green-500 text-white';
    }
    
    if (selectedAnswer === index && index !== questions[currentQuestion]?.correctAnswer) {
      return 'bg-destructive border-destructive text-white';
    }

    return 'bg-card border-border opacity-50';
  };

  // Difficulty Selection Screen
  if (difficulty === null) {
    return (
      <div className="min-h-screen p-6 lg:p-8 flex items-center justify-center" style={{ backgroundImage: `url(${worldMapBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="absolute top-4 right-4 z-10">
          <LanguageSelector />
        </div>
        <Card className="max-w-4xl w-full p-8 bg-card/95 border-2 border-primary/40 backdrop-blur-md">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4 text-center animate-slide-in">
            {t('quiz.title')}
          </h1>
          <p className="text-center text-foreground/80 mb-8 text-lg">
            {t('quiz.selectDifficulty')}
          </p>
          <p className="text-center text-foreground/60 mb-8">
            {t('quiz.difficultyDescription')}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <Button
                key={level}
                onClick={() => handleDifficultySelect(level)}
                className="h-24 flex flex-col items-center justify-center gap-2 bg-card border-2 border-primary/40 hover:border-primary hover:glow-yellow transition-smooth text-foreground hover:text-primary-foreground"
                variant="outline"
              >
                <span className="text-2xl font-bold">{t('quiz.level')} {level}</span>
                <span className="text-sm opacity-80">{t('quiz.hunger')}: {Math.max(10, 110 - level * 10)}%</span>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Check if questions are loaded
  if (questions.length === 0) {
    return (
      <div className="min-h-screen p-6 lg:p-8 flex items-center justify-center">
        <div className="absolute top-4 right-4 z-10">
          <LanguageSelector />
        </div>
        <Card className="max-w-2xl w-full p-8 bg-card border-2 border-primary/40 text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-primary mb-4">Loading Questions...</h2>
          <p className="text-foreground/70 mb-6">Please wait while we load the quiz questions.</p>
          <Button onClick={restartQuiz} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Back to Menu
          </Button>
        </Card>
      </div>
    );
  }

  if (quizComplete) {
    const finalPercentage = (score / questions.length) * 100;
    const survived = oxygenLevel > 0;
    const passed = finalPercentage >= 70;

    // Auto-restart if failed (below 70%)
    if (!passed && survived) {
      return (
        <div className="min-h-screen p-6 lg:p-8 flex items-center justify-center">
          <div className="absolute top-4 right-4 z-10">
            <LanguageSelector />
          </div>
          <Card className="max-w-2xl w-full p-8 bg-nasa-yellow text-black border-2 border-black text-center">
            <div className="text-6xl mb-6 animate-pulse">
              😢🦈
            </div>
            
            <h2 className="text-3xl font-bold text-destructive mb-4">
              {t('quiz.scoreTooLow')}
            </h2>
            
            <div className="space-y-4 mb-8">
              <p className="text-xl text-black">
                {t('quiz.finalScore')} <span className="font-bold">{score}/{questions.length}</span>
              </p>
              <p className="text-xl text-black">
                {t('quiz.accuracy')} <span className="font-bold">{finalPercentage.toFixed(0)}%</span>
              </p>
              <p className="text-lg text-black/80">
                {t('quiz.needToPass')}
              </p>
            </div>

            <div className="bg-black/20 border-2 border-black rounded-lg p-4 mb-6">
              <p className="text-black font-bold">
                {t('quiz.restarting', { level: difficulty })}
              </p>
            </div>

            <Button 
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswer(null);
                setShowExplanation(false);
                setOxygenLevel(Math.max(10, 110 - (difficulty || 1) * 10));
                setScore(0);
                setQuizComplete(false);
              }}
              className="bg-black text-nasa-yellow hover:bg-black/90"
              size="lg"
            >
              {t('quiz.tryAgain', { level: difficulty })}
            </Button>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen p-6 lg:p-8 flex items-center justify-center">
        <div className="absolute top-4 right-4 z-10">
          <LanguageSelector />
        </div>
        <Card className="max-w-2xl w-full p-8 bg-card border-2 border-primary/40 text-center">
          <div className="text-6xl mb-6 animate-float">
            {survived ? '🦈✨' : '💀'}
          </div>
          
          <h2 className="text-3xl font-bold text-primary mb-4">
            {survived ? t('quiz.excellent') : t('quiz.gameOver')}
          </h2>
          
          <div className="space-y-4 mb-8">
            <p className="text-xl text-foreground">
              {t('quiz.finalScore')} <span className="font-bold text-nasa-yellow">{score}/{questions.length}</span>
            </p>
            <p className="text-xl text-foreground">
              {t('quiz.accuracy')} <span className="font-bold text-nasa-yellow">{finalPercentage.toFixed(0)}%</span>
            </p>
            <p className="text-xl text-foreground">
              {t('quiz.hungerLevel')}: <span className="font-bold text-nasa-yellow">{oxygenLevel}%</span>
            </p>
          </div>

          {survived && passed && (
            <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-4 mb-6">
              <p className="text-green-400 font-bold">
                🏆 {t('quiz.congratulations', { level: difficulty })}
              </p>
            </div>
          )}

          <Button 
            onClick={restartQuiz}
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-yellow"
            size="lg"
          >
            {t('quiz.selectNewLevel')}
          </Button>
        </Card>
      </div>
    );
  }

  // Quiz in progress - safety check
  if (!questions[currentQuestion]) {
    return (
      <div className="min-h-screen p-6 lg:p-8 flex items-center justify-center">
        <Card className="max-w-2xl w-full p-8 bg-card border-2 border-primary/40 text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-primary mb-4">Question not found</h2>
          <Button onClick={restartQuiz} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Restart Quiz
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ backgroundImage: `url(${worldMapBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="bg-card/80 text-black p-4 rounded-lg mb-6 flex items-center justify-between" style={{ background: 'transparent' }}> 
          <h1 className="text-4xl lg:text-5xl font-bold animate-slide-in" style={{ color: '#D9240C' }}>
            {t('quiz.title')}
          </h1>
          <Badge className="text-lg px-4 py-2 bg-nasa-yellow hover:bg-nasa-yellow text-black border-2 border-nasa-yellow" style={{ background: '#D8DE46' }}>{t('quiz.level')} {difficulty}</Badge>
        </div>

        {/* Shark Avatar and Hunger */}
        <Card className="p-6 mb-6 bg-card border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl animate-float">🦈</div>
              <div>
                <h3 className="font-bold text-xl">{t('quiz.spaceShark')}</h3>
                <p className="text-sm text-foreground/70">{t('quiz.question')} {currentQuestion + 1} {t('quiz.of')} {questions.length}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-foreground/70 mb-2">{t('quiz.hungerLevel')}</p>
              <p className="text-3xl font-bold text-primary">{oxygenLevel}%</p>
            </div>
          </div>
          
          <div className="relative w-full h-6 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full ${getOxygenColor()} transition-all duration-500`}
              style={{ width: `${oxygenLevel}%` }}
            />
          </div>
          
          {oxygenLevel <= 0 && (
            <div className="mt-4 bg-destructive/20 border-2 border-destructive rounded-lg p-4 text-center animate-pulse">
              <p className="text-destructive font-bold text-xl">💀 {t('quiz.gameOver')}!</p>
              <p className="text-sm text-foreground/80 mt-2">{t('quiz.hungerDepleted')}</p>
            </div>
          )}
        </Card>

        {/* Progress */}
        <Card className="p-4 mb-6 bg-secondary border-2 border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              {t('quiz.question')} {currentQuestion + 1} {t('quiz.of')} {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {t('quiz.score')}: {score}/{questions.length}
            </span>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
        </Card>

        {/* Question Card */}
        <Card className="p-8 bg-card border-2 border-primary/40 mb-6">
          <h2 className="text-2xl font-bold mb-8 text-foreground">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showExplanation}
                className={`w-full p-5 rounded-lg border-2 text-left transition-smooth ${getButtonClass(index)}`}
              >
                <span className="font-medium">{option}</span>
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 p-6 bg-nasa-dark-blue border-2 border-primary/40 rounded-lg animate-slide-in">
              <p className="text-sm text-primary font-bold mb-2">
                {selectedAnswer === questions[currentQuestion].correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
              </p>
              <p className="text-sm text-foreground/90">
                {questions[currentQuestion].explanation}
              </p>
            </div>
          )}
        </Card>

        {showExplanation && (
          <div className="text-center">
            <Button
              onClick={handleNext}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-yellow"
              size="lg"
            >
              {currentQuestion < questions.length - 1 ? t('quiz.next') : t('quiz.selectNewLevel')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharkQuiz;
