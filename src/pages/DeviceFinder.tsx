import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Heart, Activity, Moon, Scale, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { products } from "@/data/products";

const questions = [
  {
    id: 1,
    question: "What's your primary health concern?",
    options: [
      { value: "heart", label: "Heart health & cardiac monitoring", icon: Heart },
      { value: "wellness", label: "Daily fitness & wellness tracking", icon: Activity },
      { value: "sleep", label: "Sleep quality improvement", icon: Moon },
      { value: "weight", label: "Weight & body composition", icon: Scale },
    ]
  },
  {
    id: 2,
    question: "How often do you plan to use the device?",
    options: [
      { value: "daily", label: "Daily monitoring" },
      { value: "weekly", label: "Weekly check-ups" },
      { value: "occasional", label: "Occasional use when needed" },
    ]
  },
  {
    id: 3,
    question: "Who will be using this device?",
    options: [
      { value: "personal", label: "Just myself" },
      { value: "family", label: "My entire family" },
      { value: "clinical", label: "For clinical/professional use" },
    ]
  },
];

const DeviceFinder = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const getRecommendation = () => {
    const concern = answers[1];
    return products.find(p => p.category === concern) || products[0];
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const recommendation = getRecommendation();

  if (showResults) {
    return (
      <Layout>
        <section className="py-20 bg-background min-h-[80vh] flex items-center">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                We recommend {recommendation.name}
              </h1>
              <p className="text-muted-foreground mb-8">{recommendation.description}</p>
              
              <div className="bg-card rounded-2xl p-8 border border-border mb-8">
                <img src={recommendation.image} alt={recommendation.name} className="h-40 object-contain mx-auto mb-6" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
                <ul className="text-left space-y-2 mb-6">
                  {recommendation.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-foreground">
                      <Check className="h-4 w-4 text-primary" /> {b}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full">
                  {recommendation.isExternal ? (
                    <a href={recommendation.link} target="_blank" rel="noopener noreferrer">Visit Website</a>
                  ) : (
                    <Link to={recommendation.link}>Learn More</Link>
                  )}
                </Button>
              </div>
              
              <Button variant="outline" asChild>
                <Link to="/device-finder/compare">Compare all products</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  const currentQuestion = questions[step];

  return (
    <Layout>
      <section className="py-20 bg-background min-h-[80vh] flex items-center">
        <div className="container">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex gap-2 mb-8">
              {questions.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
              {currentQuestion.question}
            </h1>
            
            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((option) => {
                const Icon = 'icon' in option ? option.icon : null;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                      answers[currentQuestion.id] === option.value
                        ? 'border-primary bg-accent'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {Icon && <Icon className="h-6 w-6 text-primary" />}
                    <span className="font-medium text-foreground">{option.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={handleNext} disabled={!answers[currentQuestion.id]}>
                {step === questions.length - 1 ? 'See Results' : 'Next'} <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default DeviceFinder;
