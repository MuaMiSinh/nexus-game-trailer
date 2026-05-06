import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/animations/CustomCursor";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { IntroScreen } from "@/components/animations/IntroScreen";
import { PageTransition } from "@/components/animations/PageTransition";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Home from "./pages/Home";
import GameDetail from "./pages/GameDetail";
import Auth from "./pages/Auth";
import Live from "./pages/Live";
import Admin from "./pages/Admin";
import CreatorLive from "./pages/CreatorLive";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split('/')[1]}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/trailers" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/game/:id" element={<PageTransition><GameDetail /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/live" element={<PageTransition><Live /></PageTransition>} />
        <Route path="/live/:id" element={<PageTransition><Live /></PageTransition>} />
        <Route path="/creator/live" element={<ProtectedRoute><PageTransition><CreatorLive /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/*" element={<ProtectedRoute adminOnly><PageTransition><Admin /></PageTransition></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <IntroScreen />
          <CustomCursor />
          <ParticleBackground />
          <Navbar />
          <main className="min-h-screen">
            <AnimatedRoutes />
          </main>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
