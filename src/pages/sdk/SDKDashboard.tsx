 import { useEffect, useState } from 'react';
 import { SDKLayout } from '@/components/sdk/SDKLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Link } from 'react-router-dom';
 import { 
   Smartphone, 
   CreditCard, 
   Download, 
   ArrowRight, 
   AlertTriangle,
   CheckCircle,
   Activity
 } from 'lucide-react';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/hooks/useAuth';
 
 interface DashboardStats {
   totalDevices: number;
   totalCredits: number;
   usedCredits: number;
   remainingCredits: number;
 }
 
 export default function SDKDashboard() {
   const { user } = useAuth();
   const [stats, setStats] = useState<DashboardStats>({
     totalDevices: 0,
     totalCredits: 0,
     usedCredits: 0,
     remainingCredits: 0,
   });
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     if (user) {
       fetchStats();
     }
   }, [user]);
 
   const fetchStats = async () => {
     try {
       // Fetch ECG credits
       const { data: credits } = await supabase
         .from('ecg_credits')
         .select('total_credits, used_credits')
         .eq('user_id', user?.id)
         .maybeSingle();
 
       if (credits) {
         setStats({
           totalDevices: 0, // Will be fetched from MongoDB later
           totalCredits: credits.total_credits,
           usedCredits: credits.used_credits,
           remainingCredits: credits.total_credits - credits.used_credits,
         });
       }
     } catch (error) {
       console.error('Error fetching stats:', error);
     } finally {
       setLoading(false);
     }
   };
 
   const lowCredits = stats.remainingCredits < 50 && stats.totalCredits > 0;
 
   return (
     <SDKLayout>
       <div className="space-y-8">
         {/* Header */}
         <div>
           <h1 className="text-3xl font-bold">Dashboard</h1>
           <p className="text-muted-foreground mt-1">
             Welcome back! Here's an overview of your SDK usage.
           </p>
         </div>
 
         {/* Alert for low credits */}
         {lowCredits && (
           <Card className="border-amber-500 bg-amber-500/10">
             <CardContent className="flex items-center gap-4 p-4">
               <AlertTriangle className="h-5 w-5 text-amber-500" />
               <div className="flex-1">
                 <p className="font-medium text-amber-700 dark:text-amber-400">
                   Low ECG Credits
                 </p>
                 <p className="text-sm text-muted-foreground">
                   You have {stats.remainingCredits} credits remaining. Consider recharging soon.
                 </p>
               </div>
               <Button asChild size="sm">
                 <Link to="/sdk/credits">Recharge Now</Link>
               </Button>
             </CardContent>
           </Card>
         )}
 
         {/* Stats Cards */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
               <Smartphone className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.totalDevices}</div>
               <p className="text-xs text-muted-foreground">
                 Registered devices
               </p>
             </CardContent>
           </Card>
 
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
               <CreditCard className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.totalCredits}</div>
               <p className="text-xs text-muted-foreground">
                 Purchased ECG credits
               </p>
             </CardContent>
           </Card>
 
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Used Credits</CardTitle>
               <Activity className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.usedCredits}</div>
               <p className="text-xs text-muted-foreground">
                 Credits consumed
               </p>
             </CardContent>
           </Card>
 
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Remaining</CardTitle>
               <CheckCircle className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.remainingCredits}</div>
               <p className="text-xs text-muted-foreground">
                 Available credits
               </p>
             </CardContent>
           </Card>
         </div>
 
         {/* Quick Actions */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Smartphone className="h-5 w-5" />
                 My Devices
               </CardTitle>
               <CardDescription>
                 View and manage your registered devices
               </CardDescription>
             </CardHeader>
             <CardContent>
               <Button asChild variant="outline" className="w-full">
                 <Link to="/sdk/devices">
                   View Devices
                   <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
               </Button>
             </CardContent>
           </Card>
 
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Download className="h-5 w-5" />
                 SDK Downloads
               </CardTitle>
               <CardDescription>
                 Download SDKs and documentation
               </CardDescription>
             </CardHeader>
             <CardContent>
               <Button asChild variant="outline" className="w-full">
                 <Link to="/sdk/downloads">
                   Browse Downloads
                   <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
               </Button>
             </CardContent>
           </Card>
 
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <CreditCard className="h-5 w-5" />
                 Recharge Credits
               </CardTitle>
               <CardDescription>
                 Purchase additional ECG credits
               </CardDescription>
             </CardHeader>
             <CardContent>
               <Button asChild variant="outline" className="w-full">
                 <Link to="/sdk/credits">
                   Recharge Now
                   <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
               </Button>
             </CardContent>
           </Card>
         </div>
 
         {/* Getting Started */}
         <Card>
           <CardHeader>
             <CardTitle>Getting Started</CardTitle>
             <CardDescription>
               Follow these steps to integrate Agatsa SDK into your application
             </CardDescription>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
               <div className="flex items-start gap-4">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                   1
                 </div>
                 <div>
                   <h4 className="font-medium">Download the SDK</h4>
                   <p className="text-sm text-muted-foreground">
                     Get the latest SDK for your platform from the Downloads section.
                   </p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                   2
                 </div>
                 <div>
                   <h4 className="font-medium">Register Your Device</h4>
                   <p className="text-sm text-muted-foreground">
                     Add your device serial number to activate it for your account.
                   </p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                   3
                 </div>
                 <div>
                   <h4 className="font-medium">Integrate & Build</h4>
                   <p className="text-sm text-muted-foreground">
                     Follow the documentation to integrate the SDK into your app.
                   </p>
                 </div>
               </div>
             </div>
           </CardContent>
         </Card>
       </div>
     </SDKLayout>
   );
 }