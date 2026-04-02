import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, CreditCard, Shield, FileText, MessageSquare, Clock, AlertCircle, Info } from 'lucide-react';
import { Card, Badge, SkeletonList } from '@/components/ui';
import { notificationService, type Notification } from '@/services/notification.service';

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  registration_approved: { icon: Shield, color: 'text-success', bg: 'bg-success/10' },
  registration_rejected: { icon: AlertCircle, color: 'text-danger', bg: 'bg-danger/10' },
  payment_confirmed:     { icon: CreditCard, color: 'text-primary', bg: 'bg-primary/10' },
  declaration_status:    { icon: FileText, color: 'text-gold-dark', bg: 'bg-gold/10' },
  message_reply:         { icon: MessageSquare, color: 'text-info', bg: 'bg-info/10' },
  subscription_expiring: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  general:               { icon: Info, color: 'text-gray-400', bg: 'bg-gray-100' },
};

export function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    notificationService.getNotifications({ limit: 50 })
      .then(res => {
        if (res.success) {
          setNotifications(res.data.notifications);
          setUnreadCount(res.data.unreadCount);
        }
      })
      .catch(() => setApiError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch { /* ignore */ }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch { /* ignore */ } finally {
      setMarkingAll(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      const notif = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (notif && !notif.isRead) setUnreadCount(c => Math.max(0, c - 1));
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="danger" size="sm">{unreadCount}</Badge>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Centre de notifications Aldiana Care.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark font-medium disabled:opacity-50 transition-colors"
          >
            <CheckCheck size={16} />
            {markingAll ? 'En cours…' : 'Tout marquer lu'}
          </button>
        )}
      </motion.div>

      {loading ? (
        <Card padding="none" className="overflow-hidden">
          <SkeletonList rows={6} />
        </Card>
      ) : apiError ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell size={36} className="text-gray-200 mb-4" />
            <p className="text-sm text-gray-500">Les notifications seront disponibles une fois le module activé.</p>
            <p className="text-xs text-gray-400 mt-1">En attendant, les informations importantes vous sont envoyées par email.</p>
          </div>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell size={36} className="text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune notification</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Les notifications concernant votre compte, vos paiements et vos demandes apparaîtront ici.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <AnimatePresence initial={false}>
            {notifications.map((notif, i) => {
              const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.general;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => {
                    if (!notif.isRead) handleMarkRead(notif.id);
                    if (notif.actionUrl) navigate(notif.actionUrl);
                  }}
                  className={`flex items-start gap-3 p-4 border-b border-gray-50 last:border-0 transition-colors ${
                    !notif.isRead ? 'bg-primary/[0.03]' : ''
                  } ${notif.actionUrl ? 'cursor-pointer hover:bg-gray-50/60' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                    <Icon size={16} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${notif.isRead ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>
                        {notif.title}
                      </p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notif.isRead && (
                          <button
                            onClick={() => handleMarkRead(notif.id)}
                            className="p-1 text-gray-300 hover:text-primary transition-colors"
                            title="Marquer comme lu"
                          >
                            <CheckCheck size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="p-1 text-gray-300 hover:text-danger transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                    <p className="text-[10px] text-gray-300 mt-1.5">
                      {new Date(notif.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Card>
      )}
    </div>
  );
}
