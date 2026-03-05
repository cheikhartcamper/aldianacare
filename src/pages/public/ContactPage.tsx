import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';

export function ContactPage() {
  return (
    <div>
      <section className="relative bg-primary py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1600&h=600&fit=crop" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary" />
        </div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-gold/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-serif">Contactez-<span className="text-gold">nous</span></h1>
            <p className="text-lg text-white/70">Notre équipe est disponible pour répondre à toutes vos questions.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              {[
                { icon: Phone, title: 'Téléphone', info: '+33 1 00 00 00 00', sub: 'Lun - Ven, 9h - 18h' },
                { icon: Mail, title: 'Email', info: 'contact@aldianacare.com', sub: 'Réponse sous 24h' },
                { icon: MapPin, title: 'Adresse', info: 'Paris, France', sub: 'Siège social' },
                { icon: Clock, title: 'Horaires', info: 'Lun - Ven: 9h - 18h', sub: 'Assistance 24/7 pour urgences' },
              ].map((item) => (
                <Card key={item.title} hover className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                    <p className="text-sm text-primary font-medium">{item.info}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Prénom" placeholder="Votre prénom" />
                    <Input label="Nom" placeholder="Votre nom" />
                  </div>
                  <Input label="Email" type="email" placeholder="votre@email.com" />
                  <Input label="Téléphone" type="tel" placeholder="+33 6 00 00 00 00" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Sujet</label>
                    <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                      <option>Informations générales</option>
                      <option>Souscription</option>
                      <option>Paiement</option>
                      <option>Rapatriement</option>
                      <option>Réclamation</option>
                      <option>Partenariat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[120px] resize-y"
                      placeholder="Votre message..."
                    />
                  </div>
                  <Button size="lg" icon={<Send size={16} />}>
                    Envoyer le message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
