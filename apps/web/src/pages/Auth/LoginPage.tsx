import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store.js";
import { login } from "@/services/auth.service.js";
import { Button } from "@/components/ui/Button.js";
import { Input } from "@/components/ui/Input.js";
import { toast } from "@/components/feedback/Toast.js";

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage(): JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const from = state?.from?.pathname ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login({ email, password });
      setAuth(result.user, result.tokens.accessToken, result.tokens.refreshToken);
      toast.success("Bem-vindo de volta!");
      navigate(from, { replace: true });
    } catch {
      setError("Email ou senha inválidos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-primary/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-accent mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary font-display tracking-tight">
            SAtomiq-OS
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            Sistema Operacional Interno
          </p>
        </div>

        {/* Form */}
        <div className="bg-bg-secondary border border-border-subtle rounded-xl p-6 shadow-elevated">
          <h2 className="text-base font-semibold text-text-primary mb-5">
            Entrar na sua conta
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="arthur@satomiq.com"
              autoComplete="email"
              leftElement={<Mail className="w-3.5 h-3.5" />}
              required
            />

            <Input
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              leftElement={<Lock className="w-3.5 h-3.5" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-tertiary hover:text-text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              }
              required
            />

            {error && (
              <div className="text-xs text-status-error bg-status-error/10 border border-status-error/20 rounded px-3 py-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-1"
            >
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-text-tertiary mt-4">
          SAtomiq © {new Date().getFullYear()} — Uso interno
        </p>
      </motion.div>
    </div>
  );
}
