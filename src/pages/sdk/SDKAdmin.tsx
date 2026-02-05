 import { useEffect, useState } from 'react';
 import { SDKLayout } from '@/components/sdk/SDKLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Textarea } from '@/components/ui/textarea';
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
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { 
   Shield, 
   Users,
   CreditCard,
   CheckCircle,
   XCircle,
   Clock,
   Loader2
 } from 'lucide-react';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/hooks/useAuth';
 import { toast } from 'sonner';
 
 interface RechargeRequest {
   id: string;
   user_id: string;
   plan_name: string;
   credits: number;
   amount: number;
   status: string;
   invoice_number: string | null;
   admin_notes: string | null;
   created_at: string;
   approved_at: string | null;
   user_profile?: {
     email: string;
     full_name: string;
     company_name: string | null;
   } | null;
 }
 
 export default function SDKAdmin() {
   const { user } = useAuth();
   const [requests, setRequests] = useState<RechargeRequest[]>([]);
   const [loading, setLoading] = useState(true);
   const [filterStatus, setFilterStatus] = useState<string>('all');
   const [selectedRequest, setSelectedRequest] = useState<RechargeRequest | null>(null);
   const [adminNotes, setAdminNotes] = useState('');
   const [isProcessing, setIsProcessing] = useState(false);
   const [stats, setStats] = useState({
     totalUsers: 0,
     pendingRequests: 0,
     totalCreditsIssued: 0,
   });
 
   useEffect(() => {
     fetchData();
   }, [filterStatus]);
 
   const fetchData = async () => {
     try {
       // Fetch recharge requests
       const { data: requestsData } = await supabase
         .from('recharge_requests')
         .select('*')
         .order('created_at', { ascending: false });
 
       if (requestsData) {
         // Filter by status if needed
         const filteredData = filterStatus === 'all' 
           ? requestsData 
           : requestsData.filter(r => r.status === filterStatus);
 
         // Fetch profiles for each request
         const requestsWithProfiles = await Promise.all(
           filteredData.map(async (request) => {
             const { data: profile } = await supabase
               .from('profiles')
               .select('email, full_name, company_name')
               .eq('id', request.user_id)
               .maybeSingle();
 
             return {
               ...request,
               user_profile: profile,
             };
           })
         );
 
         setRequests(requestsWithProfiles);
       }
 
       // Fetch stats
       const { count: usersCount } = await supabase
         .from('profiles')
         .select('*', { count: 'exact', head: true });
 
       const { count: pendingCount } = await supabase
         .from('recharge_requests')
         .select('*', { count: 'exact', head: true })
         .eq('status', 'pending');
 
       const { data: creditsData } = await supabase
         .from('recharge_requests')
         .select('credits')
         .eq('status', 'approved');
 
       const totalCredits = creditsData?.reduce((sum, r) => sum + r.credits, 0) || 0;
 
       setStats({
         totalUsers: usersCount || 0,
         pendingRequests: pendingCount || 0,
         totalCreditsIssued: totalCredits,
       });
     } catch (error) {
       console.error('Error fetching data:', error);
     } finally {
       setLoading(false);
     }
   };
 
   const handleApprove = async () => {
     if (!selectedRequest) return;
 
     setIsProcessing(true);
     try {
       // Update request status
       const { error: updateError } = await supabase
         .from('recharge_requests')
         .update({
           status: 'approved',
           approved_at: new Date().toISOString(),
           approved_by: user?.id,
           admin_notes: adminNotes || null,
         })
         .eq('id', selectedRequest.id);
 
       if (updateError) throw updateError;
 
       // Add credits to user
       const { data: currentCredits } = await supabase
         .from('ecg_credits')
         .select('total_credits')
         .eq('user_id', selectedRequest.user_id)
         .single();
 
       const newTotal = (currentCredits?.total_credits || 0) + selectedRequest.credits;
 
       const { error: creditsError } = await supabase
         .from('ecg_credits')
         .update({
           total_credits: newTotal,
           last_recharged: new Date().toISOString(),
         })
         .eq('user_id', selectedRequest.user_id);
 
       if (creditsError) throw creditsError;
 
       toast.success('Request approved and credits added successfully!');
       setSelectedRequest(null);
       setAdminNotes('');
       fetchData();
     } catch (error: any) {
       toast.error(error.message || 'Failed to approve request');
     } finally {
       setIsProcessing(false);
     }
   };
 
   const handleReject = async () => {
     if (!selectedRequest) return;
 
     setIsProcessing(true);
     try {
       const { error } = await supabase
         .from('recharge_requests')
         .update({
           status: 'rejected',
           admin_notes: adminNotes || null,
         })
         .eq('id', selectedRequest.id);
 
       if (error) throw error;
 
       toast.success('Request rejected');
       setSelectedRequest(null);
       setAdminNotes('');
       fetchData();
     } catch (error: any) {
       toast.error(error.message || 'Failed to reject request');
     } finally {
       setIsProcessing(false);
     }
   };
 
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
     <SDKLayout requireAdmin>
       <div className="space-y-6">
         {/* Header */}
         <div>
           <h1 className="text-3xl font-bold flex items-center gap-2">
             <Shield className="h-8 w-8" />
             Admin Panel
           </h1>
           <p className="text-muted-foreground mt-1">
             Manage users and recharge requests
           </p>
         </div>
 
         {/* Stats */}
         <div className="grid gap-4 md:grid-cols-3">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Total Users</CardTitle>
               <Users className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.totalUsers}</div>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
               <Clock className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.pendingRequests}</div>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Credits Issued</CardTitle>
               <CreditCard className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.totalCreditsIssued.toLocaleString()}</div>
             </CardContent>
           </Card>
         </div>
 
         {/* Recharge Requests */}
         <Card>
           <CardHeader>
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                 <CardTitle>Recharge Requests</CardTitle>
                 <CardDescription>Review and process recharge requests</CardDescription>
               </div>
               <Select value={filterStatus} onValueChange={setFilterStatus}>
                 <SelectTrigger className="w-[180px]">
                   <SelectValue placeholder="Filter by status" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Requests</SelectItem>
                   <SelectItem value="pending">Pending</SelectItem>
                   <SelectItem value="approved">Approved</SelectItem>
                   <SelectItem value="rejected">Rejected</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </CardHeader>
           <CardContent>
             {loading ? (
               <div className="flex justify-center py-8">
                 <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
               </div>
             ) : requests.length > 0 ? (
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Invoice #</TableHead>
                     <TableHead>User</TableHead>
                     <TableHead>Company</TableHead>
                     <TableHead>Plan</TableHead>
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
                       <TableCell>
                         <div>
                            <p className="font-medium">{request.user_profile?.full_name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{request.user_profile?.email || '-'}</p>
                         </div>
                       </TableCell>
                        <TableCell>{request.user_profile?.company_name || '-'}</TableCell>
                       <TableCell>
                         {request.plan_name} ({request.credits} credits)
                       </TableCell>
                       <TableCell>₹{request.amount.toLocaleString()}</TableCell>
                       <TableCell>{getStatusBadge(request.status)}</TableCell>
                       <TableCell>
                         {new Date(request.created_at).toLocaleDateString('en-IN')}
                       </TableCell>
                       <TableCell>
                         {request.status === 'pending' && (
                           <Button 
                             size="sm" 
                             onClick={() => {
                               setSelectedRequest(request);
                               setAdminNotes('');
                             }}
                           >
                             Review
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
                 <p>No recharge requests found</p>
               </div>
             )}
           </CardContent>
         </Card>
 
         {/* Review Dialog */}
         <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>Review Recharge Request</DialogTitle>
               <DialogDescription>
                 Invoice: {selectedRequest?.invoice_number}
               </DialogDescription>
             </DialogHeader>
             <div className="py-4 space-y-4">
               <div className="grid grid-cols-2 gap-4 text-sm">
                 <div>
                   <p className="text-muted-foreground">User</p>
                   <p className="font-medium">{selectedRequest?.user_profile?.full_name || 'Unknown'}</p>
                   <p className="text-xs text-muted-foreground">{selectedRequest?.user_profile?.email || '-'}</p>
                 </div>
                 <div>
                   <p className="text-muted-foreground">Company</p>
                   <p className="font-medium">{selectedRequest?.user_profile?.company_name || '-'}</p>
                 </div>
                 <div>
                   <p className="text-muted-foreground">Plan</p>
                   <p className="font-medium">{selectedRequest?.plan_name}</p>
                 </div>
                 <div>
                   <p className="text-muted-foreground">Credits</p>
                   <p className="font-medium">{selectedRequest?.credits}</p>
                 </div>
                 <div>
                   <p className="text-muted-foreground">Amount</p>
                   <p className="font-medium">₹{selectedRequest?.amount.toLocaleString()}</p>
                 </div>
                 <div>
                   <p className="text-muted-foreground">Requested On</p>
                   <p className="font-medium">
                     {selectedRequest && new Date(selectedRequest.created_at).toLocaleDateString('en-IN')}
                   </p>
                 </div>
               </div>
               <div>
                 <p className="text-sm text-muted-foreground mb-2">Admin Notes (optional)</p>
                 <Textarea
                   placeholder="Add notes about this request..."
                   value={adminNotes}
                   onChange={(e) => setAdminNotes(e.target.value)}
                 />
               </div>
             </div>
             <DialogFooter className="flex gap-2">
               <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                 Cancel
               </Button>
               <Button 
                 variant="destructive" 
                 onClick={handleReject}
                 disabled={isProcessing}
               >
                 {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                 <XCircle className="h-4 w-4 mr-2" />
                 Reject
               </Button>
               <Button 
                 onClick={handleApprove}
                 disabled={isProcessing}
               >
                 {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                 <CheckCircle className="h-4 w-4 mr-2" />
                 Approve
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>
       </div>
     </SDKLayout>
   );
 }