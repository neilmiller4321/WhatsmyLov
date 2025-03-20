import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { MortgageAffordability } from './pages/MortgageAffordability';
import PensionProjection from './pages/PensionProjection';
import { TakeHomePay } from './pages/TakeHomePay';
import { CompoundInterest } from './pages/CompoundInterest';
import { MortgagePayment } from './pages/MortgagePayment';
import CarFinanceCalculator from "./pages/CarFinanceCalculator";
import { StudentLoanCalculator } from './pages/StudentLoanCalculator';
import { ChildcareCost } from './pages/ChildcareCost';
import { ChildBenefit } from './pages/ChildBenefit';
import PurchasingPower from './pages/PurchasingPower';
import { Articles } from './pages/Articles';
import { FAQ } from './pages/FAQ';
import { About } from './pages/About';
import { Terms } from './pages/Terms';

function App() {
  const location = useLocation();

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="relative min-h-screen bg-white">
      <div className="relative">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/take-home-pay" element={<TakeHomePay />} />
          <Route path="/compound-interest" element={<CompoundInterest />} />
          <Route path="/mortgage-affordability" element={<MortgageAffordability />} />
          <Route path="/mortgage-payment" element={<MortgagePayment />} />
          <Route path="/car-payment" element={<CarFinanceCalculator />} />
          <Route path="/student-loan" element={<StudentLoanCalculator />} />
          <Route path="/childcare-cost" element={<ChildcareCost />} />
          <Route path="/child-benefit" element={<ChildBenefit />} />
          <Route path="/pension-projection" element={<PensionProjection />} />
          <Route path="/purchasing-power" element={<PurchasingPower />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/faqs" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;