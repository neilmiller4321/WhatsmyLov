
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Car, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FinanceComparisonProps {
  pcpResult: {
    monthlyPayment: number;
    deposit: number;
    balloonPayment: number;
    totalPayable: number;
    totalInterest: number;
    apr: number;
  };
  hpResult: {
    monthlyPayment: number;
    deposit: number;
    totalPayable: number;
    totalInterest: number;
    apr: number;
  };
}

const FinanceComparison = ({ pcpResult, hpResult }: FinanceComparisonProps) => {
  const fadeInVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.05 * i, duration: 0.5 }
    })
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* PCP Card */}
      <Card className="relative overflow-hidden border border-gray-100 shadow-sm interactive-card">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-primary/70" />
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">PCP</h3>
              <p className="text-sm text-muted-foreground">Personal Contract Purchase</p>
            </div>
            <div className="p-2 rounded-full bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold">£{pcpResult.monthlyPayment.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <p className="text-sm text-muted-foreground">£{pcpResult.deposit.toFixed(2)} deposit</p>
          </div>

          <div className="space-y-3 mb-6">
            {[
              { label: "Lower Monthly Payments", highlight: true },
              { label: "Optional Final Payment", highlight: true },
              { label: "Flexibility at the End of Term", highlight: true },
              { label: "Ownership Only After Final Payment", highlight: false },
              { label: "Mileage Restrictions", highlight: false }
            ].map((feature, i) => (
              <motion.div 
                key={`pcp-${i}`}
                className="flex items-center gap-2"
                custom={i}
                initial="initial"
                animate="animate"
                variants={fadeInVariants}
              >
                <div className={`p-0.5 rounded-full ${feature.highlight ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {feature.highlight ? <Check className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                </div>
                <span className={`text-sm ${feature.highlight ? "font-medium" : "text-muted-foreground"}`}>
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="py-3 px-3 rounded-lg bg-muted/30 mb-6">
            <p className="text-xs">
              Optional Final Payment: <span className="font-medium">£{pcpResult.balloonPayment.toFixed(2)}</span>
            </p>
            <p className="text-xs">
              Total Payable: <span className="font-medium">£{pcpResult.totalPayable.toFixed(2)}</span> (includes interest of £{pcpResult.totalInterest.toFixed(2)})
            </p>
            <p className="text-xs">
              Representative APR: <span className="font-medium">{pcpResult.apr}%</span>
            </p>
          </div>

          <Button variant="outline" className="w-full">Apply for PCP</Button>
        </CardContent>
      </Card>

      {/* HP Card */}
      <Card className="relative overflow-hidden border border-gray-100 shadow-sm interactive-card">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-finance-blue/50 to-finance-blue/70" />
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">HP</h3>
              <p className="text-sm text-muted-foreground">Hire Purchase</p>
            </div>
            <div className="p-2 rounded-full bg-finance-blue/10">
              <Car className="h-5 w-5 text-finance-blue" />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold">£{hpResult.monthlyPayment.toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <p className="text-sm text-muted-foreground">£{hpResult.deposit.toFixed(2)} deposit</p>
          </div>

          <div className="space-y-3 mb-6">
            {[
              { label: "Own the Car After All Payments", highlight: true },
              { label: "No Mileage Restrictions", highlight: true },
              { label: "No Final Payment", highlight: true },
              { label: "Higher Monthly Payments", highlight: false },
              { label: "Less Flexibility", highlight: false }
            ].map((feature, i) => (
              <motion.div 
                key={`hp-${i}`}
                className="flex items-center gap-2"
                custom={i}
                initial="initial"
                animate="animate"
                variants={fadeInVariants}
              >
                <div className={`p-0.5 rounded-full ${feature.highlight ? "bg-finance-blue/20 text-finance-blue" : "bg-muted text-muted-foreground"}`}>
                  {feature.highlight ? <Check className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                </div>
                <span className={`text-sm ${feature.highlight ? "font-medium" : "text-muted-foreground"}`}>
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="py-3 px-3 rounded-lg bg-muted/30 mb-6">
            <p className="text-xs">
              Total Payable: <span className="font-medium">£{hpResult.totalPayable.toFixed(2)}</span> (includes interest of £{hpResult.totalInterest.toFixed(2)})
            </p>
            <p className="text-xs">
              Representative APR: <span className="font-medium">{hpResult.apr}%</span>
            </p>
            <p className="text-xs">&nbsp;</p>
          </div>

          <Button variant="outline" className="w-full">Apply for HP</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceComparison;
