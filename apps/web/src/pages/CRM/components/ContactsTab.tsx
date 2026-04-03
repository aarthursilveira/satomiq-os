import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, Star, Plus, Users } from "lucide-react";
import { useClientContacts } from "@/hooks/useClients.js";
import { Avatar } from "@/components/ui/Avatar.js";
import { Button } from "@/components/ui/Button.js";
import { EmptyState } from "@/components/feedback/EmptyState.js";
import { Skeleton } from "@/components/feedback/Skeleton.js";

interface ContactData {
  id: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  isPrimary: boolean;
}

export function ContactsTab({ clientId }: { clientId: string }): JSX.Element {
  const { data, isLoading } = useClientContacts(clientId);
  const contacts = (data as ContactData[] | undefined) ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="card p-4 flex items-start gap-3">
            <Skeleton circle className="w-10 h-10" />
            <div className="flex-1">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-1.5" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-5 h-5" />}
        title="Nenhum contato cadastrado"
        description="Adicione pessoas de contato deste cliente."
        action={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Adicionar Contato
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {contacts.map((contact, i) => (
        <motion.div
          key={contact.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="card p-4 flex items-start gap-3 hover:border-border-default transition-all"
        >
          <Avatar name={contact.name} size="md" className="flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-sm font-semibold text-text-primary truncate">{contact.name}</p>
              {contact.isPrimary && (
                <Star className="w-3 h-3 text-status-warning fill-status-warning flex-shrink-0" />
              )}
            </div>
            {contact.role && (
              <p className="text-xs text-text-tertiary mb-2">{contact.role}</p>
            )}

            <div className="flex flex-col gap-1">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent-hover transition-colors"
                >
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent-hover transition-colors"
                >
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  {contact.phone}
                </a>
              )}
              {contact.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent-hover transition-colors"
                >
                  <MessageCircle className="w-3 h-3 flex-shrink-0" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
