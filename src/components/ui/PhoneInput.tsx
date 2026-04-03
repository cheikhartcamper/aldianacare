import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export interface Country {
  code: string;
  name: string;
  dial: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  // Afrique (prioritaires pour Aldiana Care)
  { code: 'SN', name: 'Sénégal', dial: '+221', flag: '🇸🇳' },
  { code: 'ML', name: 'Mali', dial: '+223', flag: '🇲🇱' },
  { code: 'GN', name: 'Guinée', dial: '+224', flag: '🇬🇳' },
  { code: 'CI', name: "Côte d'Ivoire", dial: '+225', flag: '🇨🇮' },
  { code: 'BF', name: 'Burkina Faso', dial: '+226', flag: '🇧🇫' },
  { code: 'MR', name: 'Mauritanie', dial: '+222', flag: '🇲🇷' },
  { code: 'GW', name: 'Guinée-Bissau', dial: '+245', flag: '🇬🇼' },
  { code: 'GM', name: 'Gambie', dial: '+220', flag: '🇬🇲' },
  { code: 'CV', name: 'Cap-Vert', dial: '+238', flag: '🇨🇻' },
  { code: 'TG', name: 'Togo', dial: '+228', flag: '🇹🇬' },
  { code: 'BJ', name: 'Bénin', dial: '+229', flag: '🇧🇯' },
  { code: 'NE', name: 'Niger', dial: '+227', flag: '🇳🇪' },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { code: 'CM', name: 'Cameroun', dial: '+237', flag: '🇨🇲' },
  { code: 'GA', name: 'Gabon', dial: '+241', flag: '🇬🇦' },
  { code: 'CG', name: 'Congo', dial: '+242', flag: '🇨🇬' },
  { code: 'CD', name: 'RD Congo', dial: '+243', flag: '🇨🇩' },
  { code: 'MA', name: 'Maroc', dial: '+212', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algérie', dial: '+213', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisie', dial: '+216', flag: '🇹🇳' },
  { code: 'EG', name: 'Égypte', dial: '+20', flag: '🇪🇬' },
  { code: 'ET', name: 'Éthiopie', dial: '+251', flag: '🇪🇹' },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
  { code: 'TZ', name: 'Tanzanie', dial: '+255', flag: '🇹🇿' },
  { code: 'ZA', name: 'Afrique du Sud', dial: '+27', flag: '🇿🇦' },
  // Europe (diaspora)
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'BE', name: 'Belgique', dial: '+32', flag: '🇧🇪' },
  { code: 'ES', name: 'Espagne', dial: '+34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italie', dial: '+39', flag: '🇮🇹' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
  { code: 'GB', name: 'Royaume-Uni', dial: '+44', flag: '🇬🇧' },
  { code: 'DE', name: 'Allemagne', dial: '+49', flag: '🇩🇪' },
  { code: 'NL', name: 'Pays-Bas', dial: '+31', flag: '🇳🇱' },
  { code: 'CH', name: 'Suisse', dial: '+41', flag: '🇨🇭' },
  { code: 'LU', name: 'Luxembourg', dial: '+352', flag: '🇱🇺' },
  { code: 'SE', name: 'Suède', dial: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norvège', dial: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Danemark', dial: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlande', dial: '+358', flag: '🇫🇮' },
  { code: 'IE', name: 'Irlande', dial: '+353', flag: '🇮🇪' },
  // Amérique
  { code: 'US', name: 'États-Unis', dial: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'BR', name: 'Brésil', dial: '+55', flag: '🇧🇷' },
  // Moyen-Orient
  { code: 'AE', name: 'Émirats arabes', dial: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Arabie Saoudite', dial: '+966', flag: '🇸🇦' },
  { code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦' },
];

const DEFAULT_COUNTRY = COUNTRIES[0]; // Sénégal par défaut

interface PhoneInputProps {
  label?: string;
  value: string;
  onChange: (fullNumber: string) => void;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

export function PhoneInput({ label, value, onChange, disabled, error, helperText }: PhoneInputProps) {
  // Parse existing value to detect country
  const detectCountry = (val: string): Country => {
    if (!val) return DEFAULT_COUNTRY;
    const matched = COUNTRIES
      .filter(c => val.startsWith(c.dial))
      .sort((a, b) => b.dial.length - a.dial.length)[0];
    return matched ?? DEFAULT_COUNTRY;
  };

  const [selected, setSelected] = useState<Country>(() => detectCountry(value));
  const [localNumber, setLocalNumber] = useState(() => {
    if (!value) return '';
    return value.startsWith(selected.dial) ? value.slice(selected.dial.length).trim() : value;
  });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCountry = (country: Country) => {
    setSelected(country);
    setOpen(false);
    setSearch('');
    onChange(`${country.dial}${localNumber}`);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d\s\-()]/g, '');
    setLocalNumber(raw);
    onChange(`${selected.dial}${raw}`);
  };

  const handleClearNumber = () => {
    setLocalNumber('');
    onChange(selected.dial);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      )}
      <div className="flex gap-0" ref={dropdownRef}>
        {/* Country selector button */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => !disabled && setOpen(prev => !prev)}
            disabled={disabled}
            className={`
              h-full flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium
              rounded-l-xl border-y border-l bg-white transition-all duration-200
              ${open ? 'border-primary ring-2 ring-primary/20 z-10' : 'border-gray-200'}
              ${error ? 'border-danger' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
            `}
          >
            <span className="text-lg leading-none">{selected.flag}</span>
            <span className="text-gray-700 text-xs font-semibold tracking-wide">{selected.dial}</span>
            <ChevronDown
              size={13}
              className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              {/* Search */}
              <div className="p-2 border-b border-gray-100">
                <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <Search size={13} className="text-gray-400 flex-shrink-0" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher un pays…"
                    className="flex-1 bg-transparent text-xs outline-none text-gray-700 placeholder:text-gray-400"
                  />
                  {search && (
                    <button type="button" onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
              {/* List */}
              <ul className="max-h-52 overflow-y-auto py-1">
                {filtered.length === 0 ? (
                  <li className="px-3 py-4 text-xs text-gray-400 text-center">Aucun résultat</li>
                ) : (
                  filtered.map(country => (
                    <li key={`${country.code}-${country.dial}`}>
                      <button
                        type="button"
                        onClick={() => handleSelectCountry(country)}
                        className={`
                          w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors
                          ${selected.code === country.code ? 'bg-primary/8 text-primary font-medium' : 'hover:bg-gray-50 text-gray-700'}
                        `}
                      >
                        <span className="text-base leading-none flex-shrink-0">{country.flag}</span>
                        <span className="flex-1 truncate text-xs">{country.name}</span>
                        <span className="text-xs text-gray-400 font-mono flex-shrink-0">{country.dial}</span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Number input */}
        <div className="relative flex-1">
          <input
            type="tel"
            value={localNumber}
            onChange={handleNumberChange}
            disabled={disabled}
            placeholder="77 123 45 67"
            className={`
              w-full rounded-r-xl border-y border-r bg-white px-3 py-2.5 text-sm text-gray-900
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              transition-all duration-200
              ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-gray-200'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${localNumber ? 'pr-8' : ''}
            `}
          />
          {localNumber && !disabled && (
            <button
              type="button"
              onClick={handleClearNumber}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Helper / preview */}
      {(localNumber || selected) && !error && (
        <p className="mt-1 text-xs text-gray-400">
          Numéro complet : <span className="font-mono text-gray-600">{selected.dial} {localNumber || '…'}</span>
        </p>
      )}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-gray-400">{helperText}</p>}
    </div>
  );
}
