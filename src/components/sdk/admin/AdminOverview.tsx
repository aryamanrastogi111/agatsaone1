 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Activity, CreditCard, TrendingUp, Loader2, Database } from 'lucide-react';
 import { useEffect, useState } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 
 interface Stats {
   totalClients: number;
   totalEcgs: number;
   thisMonthEcgs: number;
   pendingRequests: number;
   totalCreditsIssued: number;
 }
 
interface DbInfo {
  name: string;
  collections: string[];
  sampleDocFields: string[];
}

 export function AdminOverview() {
   const [stats, setStats] = useState<Stats>({
     totalClients: 0,
     totalEcgs: 0,
     thisMonthEcgs: 0,
     pendingRequests: 0,
     totalCreditsIssued: 0,
   });
   const [loading, setLoading] = useState(true);
  const [dbInfo, setDbInfo] = useState<DbInfo[] | null>(null);
  const [loadingDb, setLoadingDb] = useState(false);
 
   useEffect(() => {
     fetchStats();
   }, []);
 
   const fetchStats = async () => {
     try {
       // Fetch MongoDB stats
       const { data: { session } } = await supabase.auth.getSession();
       if (session?.access_token) {
         const response = await supabase.functions.invoke('mongodb-proxy', {
           body: { action: 'admin_get_usage_summary', filters: {} }
         });
         
         if (response.data) {
           setStats(prev => ({
             ...prev,
             totalClients: response.data.totalClients || 0,
             totalEcgs: response.data.totalEcgs || 0,
             thisMonthEcgs: response.data.thisMonthEcgs || 0,
           }));
         }
       }
 
       // Fetch Supabase stats
       const { count: pendingCount } = await supabase
         .from('recharge_requests')
         .select('*', { count: 'exact', head: true })
         .eq('status', 'pending');
 
       const { data: creditsData } = await supabase
         .from('recharge_requests')
         .select('credits')
         .eq('status', 'approved');
 
       const totalCredits = creditsData?.reduce((sum, r) => sum + r.credits, 0) || 0;
 
       setStats(prev => ({
         ...prev,
         pendingRequests: pendingCount || 0,
         totalCreditsIssued: totalCredits,
       }));
     } catch (error) {
       console.error('Error fetching stats:', error);
     } finally {
       setLoading(false);
     }
   };
 
  const fetchDatabaseInfo = async () => {
    setLoadingDb(true);
    try {
      const response = await supabase.functions.invoke('mongodb-proxy', {
        body: { action: 'admin_list_databases', filters: {} }
      });
      
      if (response.data?.databases) {
        setDbInfo(response.data.databases);
      }
    } catch (error) {
      console.error('Error fetching database info:', error);
    } finally {
      setLoadingDb(false);
    }
  };

   if (loading) {
     return (
       <div className="flex justify-center py-12">
         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
       </div>
     );
   }
 
   const statCards = [
     {
       title: 'Total SDK Clients',
       value: stats.totalClients,
       icon: Users,
       description: 'Registered SDK integrations',
     },
     {
       title: 'Total ECGs Processed',
       value: stats.totalEcgs.toLocaleString(),
       icon: Activity,
       description: 'All-time ECG recordings',
     },
     {
       title: 'This Month ECGs',
       value: stats.thisMonthEcgs.toLocaleString(),
       icon: TrendingUp,
       description: 'ECGs processed this month',
     },
     {
       title: 'Pending Requests',
       value: stats.pendingRequests,
       icon: CreditCard,
       description: 'Awaiting approval',
     },
   ];
 
   return (
     <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         {statCards.map((stat, index) => (
           <Card key={index}>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
               <stat.icon className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stat.value}</div>
               <p className="text-xs text-muted-foreground">{stat.description}</p>
             </CardContent>
           </Card>
         ))}
       </div>
 
       <Card>
         <CardHeader>
           <CardTitle>Credits Issued</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="text-3xl font-bold text-primary">
             {stats.totalCreditsIssued.toLocaleString()} credits
           </div>
           <p className="text-sm text-muted-foreground mt-1">
             Total credits approved and distributed to clients
           </p>
         </CardContent>
       </Card>

    {/* Database Debug Section */}
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            MongoDB Debug
          </CardTitle>
        </div>
        <Button onClick={fetchDatabaseInfo} disabled={loadingDb} variant="outline" size="sm">
          {loadingDb ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          List Databases
        </Button>
      </CardHeader>
      <CardContent>
        {dbInfo ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dbInfo.map((db) => (
              <div key={db.name} className="border rounded-lg p-3 bg-muted/30">
                <h4 className="font-semibold">{db.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Collections: {db.collections.length > 0 ? db.collections.join(', ') : 'None'}
                </p>
                {db.sampleDocFields.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Sample fields: {db.sampleDocFields.slice(0, 10).join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Click "List Databases" to see MongoDB structure</p>
        )}
      </CardContent>
    </Card>
     </div>
   );
 }