 import { useEffect, useState } from 'react';
 import { SDKLayout } from '@/components/sdk/SDKLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Progress } from '@/components/ui/progress';
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from '@/components/ui/table';
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
 } from '@/components/ui/dialog';
 import { 
   CreditCard, 
   Zap, 
   CheckCircle,
   Clock,
   XCircle,
   Download,
   Loader2
 } from 'lucide-react';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/hooks/useAuth';
 import { toast } from 'sonner';
 
 interface RechargeRequest {
   id: string;
   plan_name: string;
   credits: number;
   amount: number;
   status: string;
   invoice_number: string | null;
   created_at: string;
   approved_at: string | null;
 }
 
 const rechargePlans = [
   {
     id: 'starter',
     name: 'Starter',
     credits: 100,
     price: 999,
     pricePerCredit: 9.99,
     popular: false,
   },
   {
     id: 'standard',
     name: 'Standard',
     credits: 500,
     price: 3999,
     pricePerCredit: 7.99,
     popular: true,
   },
   {
     id: 'enterprise',
     name: 'Enterprise',
     credits: 1000,
     price: 6999,
     pricePerCredit: 6.99,
     popular: false,
   },
 ];
 
 export default function SDKCredits() {
   const { user } = useAuth();
   const [credits, setCredits] = useState({ total: 0, used: 0 });
   const [requests, setRequests] = useState<RechargeRequest[]>([]);
   const [loading, setLoading] = useState(true);
   const [selectedPlan, setSelectedPlan] = useState<typeof rechargePlans[0] | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
 
   useEffect(() => {
     if (user) {
       fetchData();
     }
   }, [user]);
 
   const fetchData = async () => {
     try {
       // Fetch credits
       const { data: creditsData } = await supabase
         .from('ecg_credits')
         .select('total_credits, used_credits')
         .eq('user_id', user?.id)
         .maybeSingle();
 
       if (creditsData) {
         setCredits({
           total: creditsData.total_credits,
           used: creditsData.used_credits,
         });
       }
 
       // Fetch recharge requests
       const { data: requestsData } = await supabase
         .from('recharge_requests')
         .select('*')
         .eq('user_id', user?.id)
         .order('created_at', { ascending: false });
 
       if (requestsData) {
         setRequests(requestsData);
       }
     } catch (error) {
       console.error('Error fetching data:', error);
     } finally {
       setLoading(false);
     }
   };
 
   const handleRechargeRequest = async () => {
     if (!selectedPlan || !user) return;
 
     setIsSubmitting(true);
     try {
       const { error } = await supabase.from('recharge_requests').insert({
         user_id: user.id,
         plan_name: selectedPlan.name,
         credits: selectedPlan.credits,
         amount: selectedPlan.price,
       });
 
       if (error) throw error;
 
       toast.success('Recharge request submitted successfully!');
       setSelectedPlan(null);
       fetchData();
     } catch (error: any) {
       toast.error(error.message || 'Failed to submit request');
     } finally {
       setIsSubmitting(false);
     }
   };
 
   const remaining = credits.total - credits.used;
   const usagePercent = credits.total > 0 ? (credits.used / credits.total) * 100 : 0;
 
   const getStatusBadge = (status: string) => {
     switch (status) {
       case 'pending':
         return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
       case 'approved':
         return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
       case 'rejected':
         return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
       default:
         return <Badge>{status}</Badge>;
     }
   };
 
   return (
     <SDKLayout>
       <div className="space-y-6">
         {/* Header */}
         <div>
           <h1 className="text-3xl font-bold">Credits & Recharge</h1>
           <p className="text-muted-foreground mt-1">
             Manage your ECG credits and purchase recharge packs
           </p>
         </div>
 
         {/* Current Balance */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <CreditCard className="h-5 w-5" />
               Current Balance
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="grid gap-6 md:grid-cols-3">
               <div>
                 <p className="text-sm text-muted-foreground">Total Credits</p>
                 <p className="text-3xl font-bold">{credits.total.toLocaleString()}</p>
               </div>
               <div>
                 <p className="text-sm text-muted-foreground">Used Credits</p>
                 <p className="text-3xl font-bold">{credits.used.toLocaleString()}</p>
               </div>
               <div>
                 <p className="text-sm text-muted-foreground">Remaining</p>
                 <p className="text-3xl font-bold text-primary">{remaining.toLocaleString()}</p>
               </div>
             </div>
             {credits.total > 0 && (
               <div className="mt-6">
                 <div className="flex justify-between text-sm mb-2">
                   <span>Usage</span>
                   <span>{usagePercent.toFixed(1)}%</span>
                 </div>
                 <Progress value={usagePercent} className="h-2" />
               </div>
             )}
           </CardContent>
         </Card>
 
         {/* Recharge Plans */}
         <div>
           <h2 className="text-xl font-semibold mb-4">Recharge Plans</h2>
           <div className="grid gap-4 md:grid-cols-3">
             {rechargePlans.map((plan) => (
               <Card key={plan.id} className={plan.popular ? 'border-primary' : ''}>
                 {plan.popular && (
                   <div className="bg-primary text-primary-foreground text-center text-sm py-1 font-medium">
                     Most Popular
                   </div>
                 )}
                 <CardHeader>
                   <CardTitle>{plan.name}</CardTitle>
                   <CardDescription>{plan.credits} ECG Credits</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="mb-4">
                     <span className="text-3xl font-bold">₹{plan.price.toLocaleString()}</span>
                   </div>
                   <p className="text-sm text-muted-foreground">
                     ₹{plan.pricePerCredit} per ECG
                   </p>
                 </CardContent>
                 <CardFooter>
                   <Button 
                     className="w-full" 
                     variant={plan.popular ? 'default' : 'outline'}
                     onClick={() => setSelectedPlan(plan)}
                   >
                     <Zap className="h-4 w-4 mr-2" />
                     Select Plan
                   </Button>
                 </CardFooter>
               </Card>
             ))}
           </div>
         </div>
 
         {/* Request History */}
         <Card>
           <CardHeader>
             <CardTitle>Request History</CardTitle>
             <CardDescription>Your past recharge requests and their status</CardDescription>
           </CardHeader>
           <CardContent>
             {requests.length > 0 ? (
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Invoice #</TableHead>
                     <TableHead>Plan</TableHead>
                     <TableHead>Credits</TableHead>
                     <TableHead>Amount</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>Date</TableHead>
                     <TableHead></TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {requests.map((request) => (
                     <TableRow key={request.id}>
                       <TableCell className="font-mono text-sm">
                         {request.invoice_number || '-'}
                       </TableCell>
                       <TableCell>{request.plan_name}</TableCell>
                       <TableCell>{request.credits}</TableCell>
                       <TableCell>₹{request.amount.toLocaleString()}</TableCell>
                       <TableCell>{getStatusBadge(request.status)}</TableCell>
                       <TableCell>
                         {new Date(request.created_at).toLocaleDateString('en-IN')}
                       </TableCell>
                       <TableCell>
                         {request.invoice_number && (
                           <Button variant="ghost" size="sm">
                             <Download className="h-4 w-4" />
                           </Button>
                         )}
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             ) : (
               <div className="text-center py-8 text-muted-foreground">
                 <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                 <p>No recharge requests yet</p>
               </div>
             )}
           </CardContent>
         </Card>
 
         {/* Recharge Confirmation Dialog */}
         <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>Confirm Recharge Request</DialogTitle>
               <DialogDescription>
                 You are requesting the {selectedPlan?.name} plan with {selectedPlan?.credits} ECG credits.
               </DialogDescription>
             </DialogHeader>
             <div className="py-4">
               <Card>
                 <CardContent className="pt-6">
                   <div className="space-y-2">
                     <div className="flex justify-between">
                       <span className="text-muted-foreground">Plan</span>
                       <span className="font-medium">{selectedPlan?.name}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-muted-foreground">Credits</span>
                       <span className="font-medium">{selectedPlan?.credits}</span>
                     </div>
                     <div className="flex justify-between border-t pt-2 mt-2">
                       <span className="font-medium">Total Amount</span>
                       <span className="font-bold text-lg">₹{selectedPlan?.price.toLocaleString()}</span>
                     </div>
                   </div>
                 </CardContent>
               </Card>
               <p className="text-sm text-muted-foreground mt-4">
                 After submitting, an invoice will be generated. Please complete the payment 
                 via bank transfer and our team will approve your request within 24 hours.
               </p>
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                 Cancel
               </Button>
               <Button onClick={handleRechargeRequest} disabled={isSubmitting}>
                 {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                 Submit Request
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>
       </div>
     </SDKLayout>
   );
 }