import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/utils/RequireAuth";
import { RequireLexicon } from "./components/utils/RequireLexicon";
import { AuthenticatedLayout } from "./components/templates/AuthenticatedLayout";
import { HomeRedirect } from "./pages/HomeRedirect";
import { LexiconPage } from "./pages/LexiconPage";
import { LexiconsPage } from "./pages/LexiconsPage";
import { SignInPage } from "./pages/SignInPage";
import { StoryPage } from "./pages/StoryPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/lexicons" element={<LexiconsPage />} />
            <Route element={<RequireLexicon />}>
              <Route path="/lexicon" element={<LexiconPage />} />
              <Route path="/story" element={<StoryPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
