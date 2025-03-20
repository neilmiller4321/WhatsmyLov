import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, PoundSterling, Car, CreditCard, HelpCircle, LineChart } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FinanceComparison from "@/components/FinanceComparison";
import { useToast } from "@/hooks/use-toast";

import { calculatePCP, calculateHP } from "@/lib/financeCalculations";

const CarFinanceCalculator = () => {
  const { toast } = useToast();
  const [carValue, setCarValue] = useState(20000);
  const [deposit, setDeposit] = useState(10);
  const [term, setTerm] = useState(36);
  const [pcpApr, setPcpApr] = useState(8.9);
  const [hpApr, setHpApr] = useState(7.9);
  const [useCustomRates, setUseCustomRates] = useState(false);
  const [pcpResult, setPcpResult] = useState<any>(null);
  const [hpResult, setHpResult] = useState<any>(null);

  // Recalculate when inputs change
  useEffect(() => {
    try {
      setPcpResult(calculatePCP(carValue, deposit, term, useCustomRates ? pcpApr : undefined));
      setHpResult(calculateHP(carValue, deposit, term, useCustomRates ? hpApr : undefined));
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Calculation Error",
        description: "Please check your input values and try again.",
        variant: "destructive",
      });
    }
  }, [carValue, deposit, term, pcpApr, hpApr, useCustomRates, toast]);

  return (
    <div className="container max-w-5xl px-4 py-12 mx-auto">
      {/* Hero Section */}
      <motion.div 
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 relative z-10">
            Car Finance Calculator
            <motion.div
              className="absolute -bottom-1 left-0 h-3 bg-gradient-to-r from-primary/40 to-primary/70 w-full -z-10 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Compare PCP and HP finance options to find the best deal for your new car
        </p>
      </motion.div>

      {/* Main Calculator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Section */}
        <Card className="lg:col-span-2 border border-gray-100 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    Car Value
                  </label>
                  <span className="text-sm font-medium">£{carValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <PoundSterling className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={carValue}
                    onChange={(e) => setCarValue(Number(e.target.value))}
                    min={1000}
                    max={100000}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    Deposit (%)
                  </label>
                  <span className="text-sm font-medium">{deposit}%</span>
                </div>
                <Slider
                  value={[deposit]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={(value) => setDeposit(value[0])}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    Term (months)
                  </label>
                  <span className="text-sm font-medium">{term} months</span>
                </div>
                <Slider
                  value={[term]}
                  min={12}
                  max={60}
                  step={6}
                  onValueChange={(value) => setTerm(value[0])}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>12m</span>
                  <span>36m</span>
                  <span>60m</span>
                </div>
              </div>

              {/* Custom Interest Rate Section */}
              <div className="pt-2 pb-2">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="customRates"
                    checked={useCustomRates}
                    onChange={(e) => setUseCustomRates(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="customRates" className="text-sm font-medium flex items-center gap-1.5">
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                    Use Custom Interest Rates
                  </label>
                </div>

                {useCustomRates && (
                  <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">PCP APR (%)</label>
                        <span className="text-sm font-medium">{pcpApr}%</span>
                      </div>
                      <Input
                        type="number"
                        value={pcpApr}
                        onChange={(e) => setPcpApr(Number(e.target.value))}
                        min={0}
                        max={30}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">HP APR (%)</label>
                        <span className="text-sm font-medium">{hpApr}%</span>
                      </div>
                      <Input
                        type="number"
                        value={hpApr}
                        onChange={(e) => setHpApr(Number(e.target.value))}
                        min={0}
                        max={30}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button className="w-full" size="lg">
                  Get a Quote
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Representative example: Borrowing £20,000 over 48 months with a representative APR of 8.9%, 
                  the amount payable would be £494 per month, with a total cost of credit of £3,712 and a total 
                  amount payable of £23,712.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="comparison" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="pcp">PCP</TabsTrigger>
              <TabsTrigger value="hp">HP</TabsTrigger>
            </TabsList>

            <TabsContent value="comparison" className="mt-0">
              {pcpResult && hpResult && (
                <FinanceComparison pcpResult={pcpResult} hpResult={hpResult} />
              )}
            </TabsContent>

            <TabsContent value="pcp" className="mt-0">
              {pcpResult && (
                <Card className="border border-gray-100 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      Personal Contract Purchase (PCP)
                    </h3>
                    
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Monthly Payment</TableCell>
                          <TableCell className="text-right">£{pcpResult.monthlyPayment.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Deposit</TableCell>
                          <TableCell className="text-right">£{pcpResult.deposit.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Optional Final Payment</TableCell>
                          <TableCell className="text-right">£{pcpResult.balloonPayment.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Total Amount Payable</TableCell>
                          <TableCell className="text-right">£{pcpResult.totalPayable.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Total Interest</TableCell>
                          <TableCell className="text-right">£{pcpResult.totalInterest.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">APR</TableCell>
                          <TableCell className="text-right">{pcpResult.apr}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    <div className="mt-6 bg-muted/30 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        About PCP
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        With PCP, you pay lower monthly payments but have an optional balloon payment at the end. 
                        You can either pay this to own the car, return it, or trade it in for a new one.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="hp" className="mt-0">
              {hpResult && (
                <Card className="border border-gray-100 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                        <Car className="h-4 w-4" />
                      </div>
                      Hire Purchase (HP)
                    </h3>
                    
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Monthly Payment</TableCell>
                          <TableCell className="text-right">£{hpResult.monthlyPayment.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Deposit</TableCell>
                          <TableCell className="text-right">£{hpResult.deposit.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Total Amount Payable</TableCell>
                          <TableCell className="text-right">£{hpResult.totalPayable.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Total Interest</TableCell>
                          <TableCell className="text-right">£{hpResult.totalInterest.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">APR</TableCell>
                          <TableCell className="text-right">{hpResult.apr}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    <div className="mt-6 bg-muted/30 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        About HP
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        With Hire Purchase, you'll own the car outright once all payments are made. There's no balloon 
                        payment, but monthly payments are typically higher than PCP.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Interactive Gradient Background */}
      <div className="fixed inset-0 -z-10 opacity-50">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default CarFinanceCalculator;
