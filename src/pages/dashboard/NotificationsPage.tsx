import { motion } from 'framer-motion';
import { Bell, CreditCard, FileText, Gift, Shield, Trash2 } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { useStore } from '@/store/useStore';

const typeIcons = {
  payment: CreditCard,
  contract: FileText,
  commission: Gift,
  document: Shield,
  alert: Bell,
};

const typeColors = {
  payment: 'bg-success/10 text-success',
  contract: 'bg-info/10 text-info',
  commission: 'bg-gold/10 text-gold-dark',
  document: 'bg-primary/10 text-primary',
  alert: 'bg-danger/10 text-danger',
};

export function NotificationsPage() {
  const { notifications, markNotificationRead } = useStore();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">
              {notifications.filter((n) => !n.read).length} notification(s) non lue(s)
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => notifications.forEach((n) => markNotificationRead(n.id))}>
            Tout marquer comme lu
          </Button>
        </div>
      </motion.div>

      <Card padding="none">
        <div className="divide-y divide-gray-50">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-400">Aucune notification</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = typeIcons[notif.type];
              const color = typeColors[notif.type];
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 p-4 hover:bg-gray-50/50 transition-colors cursor-pointer ${
                    !notif.read ? 'bg-primary-50/30' : ''
                  }`}
                  onClick={() => markNotificationRead(notif.id)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {notif.title}
                      </p>
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(notif.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-500 flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
