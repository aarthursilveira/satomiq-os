import { motion } from "framer-motion";
import { Settings } from "lucide-react";

export default function SettingsPage(): JSX.Element {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-9 h-9 rounded-lg bg-bg-tertiary border border-border-default flex items-center justify-center">
          <Settings className="w-4.5 h-4.5 text-text-secondary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Configurações</h1>
          <p className="text-sm text-text-tertiary mt-0.5">Preferências do sistema</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-8 flex flex-col items-center justify-center text-center gap-3"
      >
        <Settings className="w-8 h-8 text-text-tertiary" />
        <p className="text-sm font-medium text-text-primary">Em breve</p>
        <p className="text-xs text-text-tertiary max-w-xs">
          As configurações do sistema estão sendo desenvolvidas e estarão disponíveis em breve.
        </p>
      </motion.div>
    </div>
  );
}
