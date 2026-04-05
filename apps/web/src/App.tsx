import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout.js";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner.js";
import { AuthGuard } from "@/components/auth/AuthGuard.js";
import { LoginPage } from "@/pages/Auth/LoginPage.js";

// Lazy-loaded pages
const DashboardPage = lazy(() => import("@/pages/Dashboard/DashboardPage.js"));
const ClientListPage = lazy(() => import("@/pages/CRM/ClientListPage.js"));
const ClientProfilePage = lazy(() => import("@/pages/CRM/ClientProfilePage.js"));
const PipelineListPage = lazy(() => import("@/pages/Pipelines/PipelineListPage.js"));
const PipelineProfilePage = lazy(() => import("@/pages/Pipelines/PipelineProfilePage.js"));
const TasksPage = lazy(() => import("@/pages/Tasks/TasksPage.js"));
const SettingsPage = lazy(() => import("@/pages/Settings/SettingsPage.js"));

function PageLoader(): JSX.Element {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <AuthGuard>
            <AppLayout />
          </AuthGuard>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="/crm"
          element={
            <Suspense fallback={<PageLoader />}>
              <ClientListPage />
            </Suspense>
          }
        />
        <Route
          path="/pipelines"
          element={
            <Suspense fallback={<PageLoader />}>
              <PipelineListPage />
            </Suspense>
          }
        />
        <Route
          path="/pipelines/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <PipelineProfilePage />
            </Suspense>
          }
        />
        <Route
          path="/crm/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <ClientProfilePage />
            </Suspense>
          }
        />
        <Route
          path="/tasks"
          element={
            <Suspense fallback={<PageLoader />}>
              <TasksPage />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<PageLoader />}>
              <SettingsPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
