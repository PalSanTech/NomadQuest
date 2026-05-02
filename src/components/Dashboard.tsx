import React, { useState } from "react";
import { CountrySuggestion, NomadUser } from "../types";
import { GlassCard, Badge, Button } from "./ui/Common";
import { 
  Wifi, 
  ShieldCheck, 
  DollarSign, 
  Plane, 
  ChevronRight, 
  MapPin, 
  Briefcase, 
  HeartPulse, 
  Building, 
  TrainFront,
  Zap,
  Search,
  Users,
  Compass,
  CreditCard,
  Crown,
  Map as MapIcon,
  ShieldAlert,
  Phone,
  AlertTriangle,
  Flower
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ItineraryMap } from "./ItineraryMap";

interface DashboardProps {
  suggestions: CountrySuggestion[];
  onSelect: (country: CountrySuggestion) => void;
  onSearch: (city: string) => void;
  networkUsers: NomadUser[];
}

export function Dashboard({ suggestions, onSelect, onSearch, networkUsers }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<'suggestions' | 'network'>('suggestions');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 sunset-glow">
      <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
        <div className="space-y-4">
          <Badge className="bg-orange-400/10 text-orange-400 border-orange-400/20">Destination Intelligence</Badge>
          <h1 className="text-6xl font-display font-medium tracking-tight">
            Curated <span className="font-serif italic text-gradient">Nomad Retreats</span>.
          </h1>
          <p className="text-white/50 max-w-xl text-lg leading-relaxed">
            Personalized trajectories mapped against global trends. 
          </p>
        </div>

        <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/10">
          <button 
            onClick={() => setView('suggestions')}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${view === 'suggestions' ? 'bg-[#f8f5f2] text-[#0a0908]' : 'text-white/50 hover:text-white'}`}
          >
            Insights
          </button>
          <button 
            onClick={() => setView('network')}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${view === 'network' ? 'bg-[#f8f5f2] text-[#0a0908]' : 'text-white/50 hover:text-white'}`}
          >
            Network
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="max-w-xl flex gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-white/30 transition-all">
          <Search className="w-5 h-5 text-white/30" />
          <input 
            type="text" 
            placeholder="Search any city dossier..."
            className="bg-transparent border-none outline-none w-full text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit" variant="secondary" className="px-8 flex-shrink-0">
          Explore
        </Button>
      </form>

      <AnimatePresence mode="wait">
        {view === 'suggestions' ? (
          <motion.div 
            key="suggestions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {suggestions.map((item, idx) => (
              <CountryCard key={`${item.country}-${idx}`} suggestion={item} onClick={() => onSelect(item)} delay={idx * 0.1} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="network"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {networkUsers.map((user, idx) => (
              <UserCard key={user.uid} user={user} delay={idx * 0.05} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserCard({ user, delay }: { user: NomadUser; delay: number; key?: string }) {
  return (
    <GlassCard className="flex flex-col items-center text-center space-y-4 py-8" delay={delay}>
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-xl font-display border border-white/10 shadow-xl shadow-white/5">
        {user.name[0]}
      </div>
      <div>
        <h4 className="font-display font-medium text-lg">{user.name}</h4>
        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
          {user.wealth} • {new Date(user.updatedAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {user.interests.slice(0, 3).map((interest) => (
          <Badge key={interest} className="text-[8px] px-2 py-0.5 opacity-50">{interest}</Badge>
        ))}
      </div>
    </GlassCard>
  );
}

function CountryCard({ suggestion, onClick, delay }: { suggestion: CountrySuggestion; onClick: () => void; delay: number; key?: string }) {
  return (
    <GlassCard className="group cursor-pointer hover:bg-white/[0.07] transition-all p-0 overflow-hidden flex flex-col h-full hover:scale-[1.02] duration-500" delay={delay}>
      <div className="h-56 bg-white/10 relative overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${suggestion.city}/800/600`} 
          alt={suggestion.city}
          className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-110 brightness-[0.8]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
          <div>
            <Badge className="mb-2 bg-orange-400/20 text-orange-200 border-none backdrop-blur-md px-2 py-0.5 text-[9px]">
              {suggestion.country}
            </Badge>
            <h3 className="text-3xl font-display font-medium tracking-tight">{suggestion.city}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-orange-400 group-hover:text-black transition-all">
            <Compass className="w-5 h-5" />
          </div>
        </div>
      </div>
      
      <div className="p-8 space-y-8 flex-1 flex flex-col justify-between">
        <p className="text-white/60 text-lg line-clamp-3 italic font-serif leading-relaxed">
          "{suggestion.reasoning}"
        </p>
 
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 py-6 border-y border-white/5">
          <StatIcon icon={Wifi} label="Internet" value={suggestion.stats.internetSpeed} />
          <StatIcon icon={DollarSign} label="Living Cost" value={suggestion.stats.costOfLiving} />
          <StatIcon icon={ShieldCheck} label="Safety" value={suggestion.stats.safetyScore} />
          <StatIcon icon={Plane} label="Visa" value={suggestion.stats.visaEase} />
        </div>
 
        <Button onClick={onClick} variant="secondary" className="w-full">
          Access Intelligence dossier
        </Button>
      </div>
    </GlassCard>
  );
}
 
function StatIcon({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-orange-400/5 rounded-xl flex items-center justify-center border border-orange-400/10">
        <Icon className="w-4 h-4 text-orange-400/70" />
      </div>
      <div>
        <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mb-0.5">{label}</div>
        <div className="text-xs font-semibold text-white/90">{value}</div>
      </div>
    </div>
  );
}

export function CountryDetail({ country, onBack }: { country: CountrySuggestion; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'logistics' | 'stays' | 'itinerary' | 'women'>('logistics');

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-6 py-12 min-h-screen flex flex-col"
      >
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold"
        >
          <ChevronRight className="w-4 h-4 rotate-180" /> Back to suggestions
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="space-y-6">
            <Badge>{country.country}</Badge>
            <h1 className="text-8xl font-display font-medium tracking-tighter leading-[0.85] text-gradient">
              {country.city}.
            </h1>
            <p className="text-xl text-white/60 leading-relaxed font-serif italic max-w-xl">
              {country.reasoning}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-12">
               <TabButton active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} label="Logistics" icon={Briefcase} />
               <TabButton active={activeTab === 'stays'} onClick={() => setActiveTab('stays')} label="Stays" icon={Building} />
               <TabButton active={activeTab === 'women'} onClick={() => setActiveTab('women')} label="Nomad Her" icon={Flower} />
               <TabButton active={activeTab === 'itinerary'} onClick={() => setActiveTab('itinerary')} label="Plan" icon={MapIcon} />
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10">
            <img 
               src={`https://picsum.photos/seed/${country.city}-hero/1200/900`} 
               alt={country.city}
               className="w-full h-full object-cover"
               referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 grid grid-cols-4 gap-4">
               {Object.entries(country.stats).map(([k, v]) => (
                 <div key={k} className="glass-surface p-4 rounded-xl text-center">
                    <div className="text-[10px] uppercase font-bold text-white/40 mb-1">{k.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="text-sm font-display font-medium">{v}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'logistics' && (
              <motion.div 
                key="logistics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-12"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  <InfoCard icon={Plane} title="Visa Process" content={country.logistics.visaProcess} />
                  <InfoCard icon={HeartPulse} title="Health Insurance" content={country.logistics.healthInsurance} />
                  <InfoCard icon={TrainFront} title="Local Transport" content={country.logistics.transportInfo} />
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-3xl font-display font-medium flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-orange-400" /> Local Etiquette & Norms
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {country.logistics.culture?.map((tip, idx) => (
                      <div key={idx} className="flex gap-4 p-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all italic text-white/70 font-serif text-lg leading-relaxed">
                        <span className="text-orange-400 font-bold shrink-0">·</span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-3xl font-display font-medium flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-rose-400" /> Safety & Emergency Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-white/40">Critical Contacts</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="glass-surface p-4 rounded-2xl flex items-center gap-4">
                           <div className="p-2 bg-rose-500/10 rounded-lg"><Phone className="w-4 h-4 text-rose-400" /></div>
                           <div>
                              <div className="text-[10px] uppercase font-bold text-white/40">Police</div>
                              <div className="text-xl font-display font-medium">{country.logistics.safety?.emergencyNumbers.police}</div>
                           </div>
                        </div>
                        <div className="glass-surface p-4 rounded-2xl flex items-center gap-4">
                           <div className="p-2 bg-rose-500/10 rounded-lg"><Phone className="w-4 h-4 text-rose-400" /></div>
                           <div>
                              <div className="text-[10px] uppercase font-bold text-white/40">Ambulance</div>
                              <div className="text-xl font-display font-medium">{country.logistics.safety?.emergencyNumbers.ambulance}</div>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-sm font-bold uppercase tracking-widest text-white/40">Risk Assessment</h4>
                       <div className="glass-surface p-6 rounded-[2rem] flex gap-4 border-rose-500/20 bg-rose-500/[0.02]">
                          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                          <p className="text-white/70 italic font-serif text-lg leading-relaxed">{country.logistics.safety?.precautions}</p>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white/40">Security Protocols for Nomads</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {country.logistics.safety?.nomadTips.map((tip, idx) => (
                        <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-sm text-white/60 leading-relaxed italic">
                           {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'women' && (
              <motion.div 
                key="women"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div className="grid lg:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-4xl font-display font-medium text-rose-300">Essential <span className="font-serif italic">Solo Her</span> Presence.</h3>
                        <p className="text-white/50 font-serif italic text-lg leading-relaxed">
                          Tailored intelligence for the female digital nomad navigating {country.city}.
                        </p>
                      </div>

                      <div className="grid gap-6">
                        <div className="glass-surface p-8 rounded-[2.5rem] space-y-4 border-rose-500/10">
                           <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400 flex items-center gap-2">
                              <Compass className="w-4 h-4" /> Dress Code Intelligence
                           </h4>
                           <p className="text-xl text-white/80 font-serif leading-relaxed italic">{country.logistics.womenSpecific?.dressCode}</p>
                        </div>

                        <div className="glass-surface p-8 rounded-[2.5rem] space-y-4 border-rose-500/10">
                           <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400 flex items-center gap-2">
                              <Briefcase className="w-4 h-4" /> Personal Hygiene Logistics
                           </h4>
                           <p className="text-lg text-white/60 leading-relaxed italic font-serif">{country.logistics.womenSpecific?.hygieneProductsAvailability}</p>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div className="glass-surface p-10 rounded-[3rem] space-y-8 bg-gradient-to-br from-rose-500/[0.05] to-transparent border-rose-500/20">
                         <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-rose-300">Security & Integration Protocols</h4>
                         <div className="space-y-6">
                            {country.logistics.womenSpecific?.safetyTips.map((tip, idx) => (
                               <div key={idx} className="flex gap-6 items-start group">
                                  <div className="w-10 h-10 rounded-full border border-rose-500/20 flex items-center justify-center font-display font-bold text-rose-400 group-hover:bg-rose-400 group-hover:text-black transition-all shrink-0">
                                     {idx + 1}
                                  </div>
                                  <p className="text-white/70 italic text-lg font-serif leading-relaxed pt-1">{tip}</p>
                               </div>
                            ))}
                         </div>

                         <div className="pt-10 border-t border-rose-500/10">
                            <h5 className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-4">Master Solo Advice</h5>
                            <div className="p-6 rounded-3xl bg-[#0a0908] border border-white/5 text-white/50 text-sm leading-relaxed italic font-serif">
                               "{country.logistics.womenSpecific?.soloTravelAdvice}"
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                           <TrainFront className="w-4 h-4" /> Transit & Security Intelligence
                         </h4>
                         <div className="grid gap-4">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                               <div className="text-[10px] font-bold uppercase text-orange-400">Public Transit Protocol</div>
                               <p className="text-sm text-white/70 italic leading-relaxed">{country.logistics.womenSpecific?.transportSafety?.publicTransport}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                               <div className="text-[10px] font-bold uppercase text-orange-400">Ride-Sharing Strategy</div>
                               <p className="text-sm text-white/70 italic leading-relaxed">{country.logistics.womenSpecific?.transportSafety?.rideSharing}</p>
                            </div>
                            <div className="p-6 rounded-3xl border border-rose-500/20 bg-rose-500/[0.03] space-y-3">
                               <div className="text-[10px] font-bold uppercase text-rose-400">Common Scams & Red Flags</div>
                               <ul className="space-y-2">
                                  {country.logistics.womenSpecific?.transportSafety?.scams.map((scam, i) => (
                                     <li key={i} className="text-sm text-white/60 flex gap-2">
                                        <span className="text-rose-400">•</span> {scam}
                                     </li>
                                  ))}
                               </ul>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'stays' && (
              <motion.div 
                key="stays"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <BudgetTierCard 
                    tier={country.budgets.affordable} 
                    icon={CreditCard} 
                    color="text-emerald-400"
                  />
                  <BudgetTierCard 
                    tier={country.budgets.luxury} 
                    icon={Crown} 
                    color="text-amber-400"
                  />
                </div>

                <div className="space-y-6">
                   <h3 className="text-3xl font-display font-medium flex items-center gap-3">
                    <Zap className="w-6 h-6 text-white/40" /> Workspace Ecosystem
                  </h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {country.recommendations.coworking.map((space, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all">
                        <div className="text-white/40 mb-2"><Briefcase className="w-4 h-4" /></div>
                        <div className="font-medium text-lg">{space}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'itinerary' && (
              <motion.div 
                key="itinerary"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="grid lg:grid-cols-[1fr,420px] gap-16"
              >
                <div className="space-y-12">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-display font-medium">The <span className="font-serif italic text-gradient">Master Plan</span>.</h3>
                    <p className="text-white/40 font-serif italic text-lg">A logic-based trajectory through the local landscape.</p>
                  </div>

                  <div className="space-y-0 relative">
                    <div className="absolute left-[23px] top-4 bottom-4 w-px bg-gradient-to-b from-orange-400/50 via-white/10 to-transparent" />
                    
                    {country.itinerary.map((day, idx) => (
                      <motion.div 
                        key={day.day} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative pl-20 pb-16 group last:pb-0"
                      >
                        <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-[#0a0908] border border-white/10 flex items-center justify-center font-display font-medium text-lg group-hover:border-orange-400/50 group-hover:text-orange-400 transition-all z-10 shadow-2xl">
                          {day.day}
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-3xl font-display font-medium tracking-tight group-hover:text-gradient transition-all">{day.activity}</h4>
                          <div className="glass-surface p-8 rounded-[2.5rem] relative overflow-hidden group-hover:bg-white/[0.06] transition-all">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all">
                              <Compass className="w-12 h-12" />
                            </div>
                            <p className="text-xl text-white/70 leading-relaxed font-serif italic relative z-10">
                              {day.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="lg:sticky lg:top-8 h-fit space-y-8">
                   <div className="space-y-6">
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                        <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Spatial Coordinates</h4>
                        <Badge className="bg-orange-400/10 text-orange-400 border-none">Live Plot</Badge>
                      </div>
                      <ItineraryMap itinerary={country.itinerary} />
                      <div className="glass-surface p-6 rounded-3xl space-y-4">
                        <h5 className="text-[10px] uppercase font-bold tracking-widest text-white/40">Navigation Logic</h5>
                        <p className="text-sm text-white/50 leading-relaxed italic font-serif">
                          Each marker represents a mission-critical node in your short-term integration. Use the interactive interface to visualize proximity and transit demands.
                        </p>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function BudgetTierCard({ tier, icon: Icon, color }: { tier: any; icon: any; color: string }) {
  return (
    <GlassCard className="space-y-6 flex flex-col h-full border-t-2 border-t-white/10 hover:border-t-white/30 transition-all">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Badge className={`${color} bg-white/5 border-none`}>{tier.category}</Badge>
          <h4 className="text-3xl font-display font-medium">{tier.estimatedMonthly}</h4>
          <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Est. Monthly Base</p>
        </div>
        <div className={`p-3 bg-white/5 rounded-2xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <p className="text-sm font-serif italic text-white/60 leading-relaxed">
        {tier.lifestyle}
      </p>

      <div className="space-y-3 pt-4 border-t border-white/5 mt-auto">
        <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Top Tier Stays</div>
        <div className="grid gap-2">
          {tier.stays.map((s: string, idx: number) => (
            <div key={idx} className="flex items-center gap-3 text-xs font-medium text-white/80">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              {s}
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function TabButton({ active, onClick, label, icon: Icon }: { active: boolean; onClick: () => void; label: string; icon: any }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-4 rounded-full border flex items-center gap-2 transition-all ${
        active 
          ? "bg-[#f8f5f2] text-[#0a0908] border-[#f8f5f2]" 
          : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-bold tracking-wide uppercase">{label}</span>
    </button>
  );
}

function InfoCard({ icon: Icon, title, content }: { icon: any; title: string; content: string }) {
  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-lg">
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="font-display font-medium text-xl">{title}</h4>
      </div>
      <p className="text-white/50 text-sm leading-relaxed">{content}</p>
    </GlassCard>
  );
}
