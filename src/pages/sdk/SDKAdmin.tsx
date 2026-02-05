 import { SDKLayout } from '@/components/sdk/SDKLayout';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Shield, LayoutDashboard, Users, CreditCard } from 'lucide-react';
 import { AdminOverview, AdminClientsTable, AdminRechargeRequests } from '@/components/sdk/admin';
 
 export default function SDKAdmin() {
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
             Manage SDK clients, usage data, and recharge requests
           </p>
         </div>
 
         {/* Tabs */}
         <Tabs defaultValue="overview" className="space-y-6">
           <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
             <TabsTrigger value="overview" className="flex items-center gap-2">
               <LayoutDashboard className="h-4 w-4" />
               <span className="hidden sm:inline">Overview</span>
             </TabsTrigger>
             <TabsTrigger value="clients" className="flex items-center gap-2">
               <Users className="h-4 w-4" />
               <span className="hidden sm:inline">Clients</span>
             </TabsTrigger>
             <TabsTrigger value="recharge" className="flex items-center gap-2">
               <CreditCard className="h-4 w-4" />
               <span className="hidden sm:inline">Recharge</span>
             </TabsTrigger>
           </TabsList>
 
           <TabsContent value="overview">
             <AdminOverview />
           </TabsContent>
 
           <TabsContent value="clients">
             <AdminClientsTable />
           </TabsContent>
 
           <TabsContent value="recharge">
             <AdminRechargeRequests />
           </TabsContent>
         </Tabs>
       </div>
     </SDKLayout>
   );
 }