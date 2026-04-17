import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import { UserProvider } from "@/contexts/UserContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Event from "./pages/Event";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import FAQPage from "./pages/faq";
import TermsPage from "./pages/terms";
import PrivacyPage from "./pages/privacy";
import CookiesPage from "./pages/cookies";
import Admin from "./pages/Admin";
import ConcertsPage from './pages/ConcertsPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LazyMotion features={domAnimation}>
      <TooltipProvider>
        <UserProvider>
          <ThemeProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/event/:id" element={<Event />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/cookies" element={<CookiesPage />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/concerts" element={<ConcertsPage />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </UserProvider>
      </TooltipProvider>
    </LazyMotion>
  </QueryClientProvider>
);

export default App;