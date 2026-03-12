import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, User, Mail, Phone, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { Button, Input, Logo, PageLoader } from '@/components/ui';
import { declarationService, type DeceasedUser } from '@/services/declaration.service';

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
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/">
            <Logo size="sm" variant="color" />
          </Link>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </nav>

      {/* Hero compact */}
      <section className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium uppercase tracking-wide mb-4 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              Étape 1/5
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Rechercher l'assuré décédé
            </h1>
            <p className="text-gray-400 text-sm">
              Identifiez la personne par son nom, email ou numéro de téléphone
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main form */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
              {/* Search type tabs */}
              <div className="grid grid-cols-3 gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
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
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
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

                <Button type="submit" size="lg" fullWidth disabled={isSearching} className="shadow-lg">
                  <Search size={18} />
                  Rechercher
                </Button>
              </form>

              {/* Results */}
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-8 border-t border-gray-100"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle size={18} className="text-primary" />
                    <p className="font-semibold text-gray-900">
                      {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {results.map((deceased) => (
                      <button
                        key={deceased.id}
                        onClick={() => handleSelectDeceased(deceased)}
                        className="w-full p-5 bg-gray-50 hover:bg-primary-50 border-2 border-gray-200 hover:border-primary rounded-xl text-left transition-all group"
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
                              <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                                {deceased.planType === 'individual' ? 'Plan Individuel' : 'Plan Familial'}
                              </span>
                              <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                                Rapatriement: {deceased.repatriationCountry}
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={22} className="text-gray-300 group-hover:text-primary flex-shrink-0" />
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
