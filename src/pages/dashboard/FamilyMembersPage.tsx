import { motion } from 'framer-motion';
import { Users, User, Calendar, Phone, Mail, MapPin, Shield, AlertTriangle } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

export function FamilyMembersPage() {
  const { user, familyMembers } = useAuth();

  const isFamilyPlan = user?.planType === 'family';

  if (!isFamilyPlan) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900">Membres de la famille</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les membres couverts par votre plan familial.</p>
        </motion.div>

        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Plan individuel</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Vous avez souscrit au plan individuel. Pour ajouter des membres de votre famille,
              contactez notre équipe pour passer au plan familial.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Membres de la famille</h1>
            <p className="text-sm text-gray-500 mt-1">
              {familyMembers.length} membre{familyMembers.length !== 1 ? 's' : ''} couvert{familyMembers.length !== 1 ? 's' : ''} par votre plan familial
            </p>
          </div>
          <Badge variant="primary" size="sm">
            Plan Familial
          </Badge>
        </div>
      </motion.div>

      {/* Info souscripteur */}
      <Card className="border-l-4 border-l-primary">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Souscripteur principal</h3>
            <p className="text-xs text-gray-500">Titulaire du contrat familial</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-lg">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Mail size={11} /> {user?.email}</span>
                <span className="flex items-center gap-1"><Phone size={11} /> {user?.phone}</span>
              </div>
            </div>
            <Badge variant="success" dot size="sm">Souscripteur</Badge>
          </div>
        </div>
      </Card>

      {/* Liste des membres */}
      {familyMembers.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <Users size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Aucun membre enregistré</p>
            <p className="text-xs text-gray-300 mt-1">
              Les membres de votre famille apparaîtront ici après validation de votre inscription.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {familyMembers.map((member, index) => {
            const age = calculateAge(member.dateOfBirth);
            const isAdult = age >= 18;

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isAdult ? 'bg-primary/10' : 'bg-gold/10'
                    }`}>
                      <User size={22} className={isAdult ? 'text-primary' : 'text-gold-dark'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="text-base font-semibold text-gray-900">
                          {member.firstName} {member.lastName}
                        </h3>
                        <Badge variant={isAdult ? 'primary' : 'warning'} size="sm">
                          {isAdult ? 'Majeur' : 'Mineur'}
                        </Badge>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          <span>
                            {new Date(member.dateOfBirth).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                            <span className="text-xs text-gray-400 ml-1">({age} ans)</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          <span>{member.phone}</span>
                        </div>
                        {member.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-400" />
                            <span>{member.email}</span>
                          </div>
                        )}
                        {member.residenceCountry && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={14} className="text-gray-400" />
                            <span>{member.residenceCountry}</span>
                          </div>
                        )}
                      </div>

                      {member.residenceAddress && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-0.5">Adresse de résidence</p>
                          <p className="text-sm text-gray-700">{member.residenceAddress}</p>
                        </div>
                      )}

                      {member.repatriationCountry && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <Shield size={12} className="text-primary" />
                          Rapatriement prévu vers : <span className="font-medium text-gray-700">{member.repatriationCountry}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Note modification */}
      <Card className="bg-amber-50 border-amber-200">
        <div className="flex gap-3">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Modification des membres</p>
            <p className="text-xs text-amber-700 mt-1">
              Pour ajouter ou modifier des membres de votre famille, contactez notre équipe support
              avec vos justificatifs (acte de naissance, livret de famille, etc.).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
