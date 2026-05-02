/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { OnboardingForm } from "./components/OnboardingForm";
import { Dashboard, CountryDetail } from "./components/Dashboard";
import { NomadState, UserProfile, CountrySuggestion, NomadUser } from "./types";
import { getNomadSuggestions, searchCityInfo } from "./services/geminiService";
import { auth, googleProvider, signInWithPopup, onAuthStateChanged, User } from "./lib/firebase";
import { syncUserProfile, subscribeToNetwork } from "./services/firebaseService";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Globe, LogIn } from "lucide-react";
import { Button } from "./components/ui/Common";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<NomadState>({
    profile: null,
    suggestions: [],
    selectedCountry: null,
    isLoading: false,
    networkUsers: [],
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) {
      const unsub = subscribeToNetwork((users) => {
        setState(prev => ({ ...prev, networkUsers: users }));
      });
      return () => unsub();
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    setState(prev => ({ ...prev, profile, isLoading: true }));
    
    try {
      if (user) {
        await syncUserProfile(profile);
      }
      const suggestions = await getNomadSuggestions(profile);
      setState(prev => ({ ...prev, suggestions, isLoading: false }));
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSearch = async (city: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await searchCityInfo(city);
      setState(prev => ({ 
        ...prev, 
        selectedCountry: result, 
        isLoading: false,
        // Optional: add to suggestions if not present
        suggestions: prev.suggestions.find(s => s.city.toLowerCase() === result.city.toLowerCase()) 
          ? prev.suggestions 
          : [result, ...prev.suggestions]
      }));
    } catch (error) {
      console.error("Search failed:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const selectCountry = (country: CountrySuggestion) => {
    setState(prev => ({ ...prev, selectedCountry: country }));
  };

  const deselectCountry = () => {
    setState(prev => ({ ...prev, selectedCountry: null }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
             <div className="p-4 rounded-full border border-white/10 bg-white/5">
                <Globe className="w-12 h-12 text-white/50" />
             </div>
          </div>
          <h1 className="text-6xl font-display font-medium tracking-tight">
            Nomad<span className="font-serif italic">Sphere</span>.
          </h1>
          <p className="text-white/40 max-w-sm mx-auto text-lg leading-relaxed">
            Protocol for the borderless class. Authenticate to begin your trajectory.
          </p>
        </div>
        <Button onClick={handleLogin} className="px-12 py-4 text-lg">
          <LogIn className="w-5 h-5 mr-2" /> Connect via Google
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0908] text-[#f8f5f2] font-sans selection:bg-[#f8f5f2] selection:text-[#0a0908] sunset-glow">
      <AnimatePresence mode="wait">
        {state.isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center space-y-8 z-[100] bg-black"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="p-8 rounded-full border border-white/20"
            >
              <Compass className="w-12 h-12 text-white/50" />
            </motion.div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-display font-medium tracking-tight">Calculating Your <span className="font-serif italic text-white/70">Ideal Meridian</span></h2>
              <p className="text-white/40 animate-pulse uppercase tracking-[0.2em] text-[10px] font-bold">Querying Global Indices • Synchronizing Lifestyles</p>
            </div>
          </motion.div>
        ) : !state.profile ? (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OnboardingForm onComplete={handleOnboardingComplete} />
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
             <Dashboard 
               suggestions={state.suggestions} 
               onSelect={selectCountry} 
               onSearch={handleSearch}
               networkUsers={state.networkUsers}
             />
             
             {state.selectedCountry && (
               <CountryDetail country={state.selectedCountry} onBack={deselectCountry} />
             )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/[0.03] blur-[120px] rounded-full" />
      </div>

      {!state.isLoading && state.profile && (
        <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex justify-between items-center text-white/20">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">NomadSphere Protocol v1.0</span>
          </div>
          <div className="text-[10px] uppercase tracking-tighter">
            Architected for {user.displayName}
          </div>
        </footer>
      )}
    </div>
  );
}
