import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/utils/RequireAuth";
import { AuthenticatedLayout } from "./components/templates/AuthenticatedLayout";
import { LexiconPage } from "./pages/LexiconPage";
import { SignInPage } from "./pages/SignInPage";
import { StoryPage } from "./pages/StoryPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<Navigate to="/lexicon" replace />} />
            <Route path="/lexicon" element={<LexiconPage />} />
            <Route path="/story" element={<StoryPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/lexicon" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
