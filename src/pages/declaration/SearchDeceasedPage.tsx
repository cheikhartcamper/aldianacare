import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, User, Mail, Phone, AlertCircle, ArrowRight, CheckCircle, ArrowLeft, Shield } from 'lucide-react';
import { Button, Input, Logo, PageLoader, StepProgress } from '@/components/ui';
import { declarationService, type DeceasedUser } from '@/services/declaration.service';

const DECLARATION_STEPS = ['Recherche', 'Identité', 'Code OTP', 'Validation', 'Déclaration'];

export function SearchDeceasedPage() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<'name' | 'email' | 'phone'>('name');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<DeceasedUser[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults([]);
    setIsSearching(true);

    try {
      const input: any = {};
      if (searchType === 'name') {
        if (!firstName.trim() || !lastName.trim()) {
          setError('Veuillez saisir le prénom et le nom.');
          setIsSearching(false);
          return;
        }
        input.firstName = firstName.trim();
        input.lastName = lastName.trim();
      } else if (searchType === 'email') {
        if (!email.trim()) {
          setError('Veuillez saisir l\'adresse email.');
          setIsSearching(false);
          return;
        }
        input.email = email.trim();
      } else if (searchType === 'phone') {
        if (!phone.trim()) {
          setError('Veuillez saisir le numéro de téléphone.');
          setIsSearching(false);
          return;
        }
        input.phone = phone.trim();
      }

      const response = await declarationService.searchDeceased(input);
      
      if (response.success && response.data.users.length > 0) {
        setResults(response.data.users);
      } else {
        setError('Aucun utilisateur trouvé avec ces critères de recherche.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la recherche. Veuillez réessayer.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectDeceased = (deceased: DeceasedUser) => {
    navigate('/declaration/verify-declarant', { state: { deceased } });
  };

  if (isSearching) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold/5">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-primary border-b border-primary-dark">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" variant="white" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-white/70 text-xs">
              <Shield size={12} />
              <span>Processus sécurisé</span>
            </div>
            <Link to="/" className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft size={14} />
              Accueil
            </Link>
          </div>
        </div>
      </nav>

      {/* Step Progress */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <StepProgress steps={DECLARATION_STEPS} currentStep={0} />
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold/10 rounded-full blur-[80px]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-10 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide mb-3 border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Étape 1 sur 5
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Rechercher l'assuré <span className="text-primary">décédé</span>
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Identifiez la personne par son nom, email ou numéro de téléphone
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main form */}
      <section className="pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-primary/5 p-6 lg:p-8">
              {/* Search type tabs */}
              <div className="grid grid-cols-3 gap-2 mb-8 p-1.5 bg-primary-50/50 rounded-xl border border-primary/10">
                {[
                  { type: 'name' as const, icon: User, label: 'Par nom' },
                  { type: 'email' as const, icon: Mail, label: 'Par email' },
                  { type: 'phone' as const, icon: Phone, label: 'Par téléphone' },
                ].map((tab) => (
                  <button
                    key={tab.type}
                    onClick={() => setSearchType(tab.type)}
                    className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                      searchType === tab.type
                        ? 'bg-primary text-white shadow-sm shadow-primary/20'
                        : 'text-gray-600 hover:text-primary hover:bg-white'
                    }`}
                  >
                    <tab.icon size={14} className="inline mr-1.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search form */}
              <form onSubmit={handleSearch} className="space-y-5">
                {searchType === 'name' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex: Fatou"
                      required
                    />
                    <Input
                      label="Nom de famille"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ex: Fall"
                      required
                    />
                  </div>
                )}

                {searchType === 'email' && (
                  <Input
                    label="Adresse email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: fatou.fall@email.com"
                    required
                  />
                )}

                {searchType === 'phone' && (
                  <Input
                    label="Numéro de téléphone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: +221771742350"
                    required
                  />
                )}

                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                      <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </motion.div>
                )}

                <Button type="submit" size="lg" fullWidth disabled={isSearching} className="shadow-lg shadow-primary/20">
                  <Search size={18} />
                  Rechercher
                </Button>
              </form>

              {/* Results */}
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="mt-8 pt-8 border-t border-primary/10"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle size={14} className="text-primary" />
                    </div>
                    <p className="font-semibold text-gray-900">
                      {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {results.map((deceased) => (
                      <button
                        key={deceased.id}
                        onClick={() => handleSelectDeceased(deceased)}
                        className="w-full p-5 bg-gradient-to-r from-primary-50/50 to-transparent hover:from-primary-50 border-2 border-primary/10 hover:border-primary rounded-xl text-left transition-all group"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 group-hover:text-primary mb-1 text-lg">
                              {deceased.firstName} {deceased.lastName}
                            </p>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Mail size={13} />
                                {deceased.email}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Phone size={13} />
                                {deceased.phone}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20">
                                {deceased.planType === 'individual' ? 'Plan Individuel' : 'Plan Familial'}
                              </span>
                              <span className="text-xs font-semibold bg-gold/10 text-gold-dark px-2.5 py-1 rounded-lg border border-gold/20">
                                Rapatriement: {deceased.repatriationCountry}
                              </span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-primary/5 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all">
                            <ArrowRight size={18} className="text-primary group-hover:text-white" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
