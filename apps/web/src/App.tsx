import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/utils/RequireAuth";
import { AuthenticatedLayout } from "./components/templates/AuthenticatedLayout";
import { HomePage } from "./pages/HomePage";
import { SignInPage } from "./pages/SignInPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
