import { useState } from "react";
import { UserProfile, Lifestyle, WealthRange } from "../types";
import { Button, GlassCard } from "./ui/Common";
import { Compass, Palmtree, Mountain, Building2, Map, Zap, DollarSign, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const LIFESTYLES: { id: Lifestyle; label: string; icon: any }[] = [
  { id: "beach", label: "Beach Life", icon: Palmtree },
  { id: "mountain", label: "Mountain High", icon: Mountain },
  { id: "urban", label: "Urban Jungle", icon: Building2 },
  { id: "slow-life", label: "Slow Living", icon: Map },
  { id: "trekking", label: "Adventure/Trek", icon: Compass },
];

const WEALTH_LEVELS: { id: WealthRange; label: string; desc: string }[] = [
  { id: "budget", label: "Budget", desc: "Mindful of every penny" },
  { id: "comfortable", label: "Comfortable", desc: "Good balance of value & quality" },
  { id: "luxury", label: "Luxury", desc: "Premium stays & experiences" },
];

export function OnboardingForm({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    interests: [],
    wealth: "comfortable",
    internetRequirement: "stable",
    visaStatus: "flexible",
  });

  const toggleInterest = (id: Lifestyle) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  return (
    <div className="max-w-xl mx-auto py-12 px-4 min-h-[80vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl font-display font-medium leading-tight">
                Welcome to <span className="italic font-serif">NomadSphere</span>.
              </h1>
              <p className="text-white/60 text-lg">Tell us who you are before we chart your course.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 group focus-within:border-white/40 transition-all">
                <div className="p-3 bg-white/10 rounded-xl">
                  <User className="w-5 h-5 text-white/70" />
                </div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="bg-transparent border-none outline-none w-full text-xl"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <Button onClick={handleNext} disabled={!formData.name} className="w-full">
                Begin Exploration
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-medium">What's your vibe?</h2>
              <p className="text-white/60">Select one or more lifestyles that draw you.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {LIFESTYLES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => toggleInterest(id)}
                  className={`p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all ${
                    formData.interests.includes(id)
                      ? "bg-white text-black border-white"
                      : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                  }`}
                >
                  <Icon className="w-8 h-8" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <Button onClick={handleBack} variant="outline" className="flex-1">Back</Button>
              <Button onClick={handleNext} disabled={formData.interests.length === 0} className="flex-1">Continue</Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-medium">Wealth & Connectivity</h2>
              <p className="text-white/60">Help us match your budget and tech needs.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm uppercase tracking-widest text-white/50 font-bold">Planned Budget</label>
                <div className="grid gap-3">
                  {WEALTH_LEVELS.map(({ id, label, desc }) => (
                    <button
                      key={id}
                      onClick={() => setFormData({ ...formData, wealth: id })}
                      className={`p-4 rounded-xl border text-left transition-all flex justify-between items-center ${
                        formData.wealth === id
                          ? "bg-white text-black border-white"
                          : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                      }`}
                    >
                      <div>
                        <div className="font-bold">{label}</div>
                        <div className="text-sm opacity-60">{desc}</div>
                      </div>
                      <DollarSign className={`w-5 h-5 ${formData.wealth === id ? "text-black" : "text-white/30"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm uppercase tracking-widest text-white/50 font-bold">Internet Speed Tasking</label>
                <div className="flex gap-3">
                  {["minimum", "stable", "high-speed"].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setFormData({ ...formData, internetRequirement: lvl as any })}
                      className={`flex-1 p-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                        formData.internetRequirement === lvl
                          ? "bg-white text-black border-white"
                          : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleBack} variant="outline" className="flex-1">Back</Button>
                <Button onClick={() => onComplete(formData)} className="flex-1 bg-white hover:bg-white/90 text-black">
                  Finalize Path
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
