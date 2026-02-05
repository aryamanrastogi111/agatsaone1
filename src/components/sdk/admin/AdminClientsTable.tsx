 import { useEffect, useState } from 'react';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Input } from '@/components/ui/input';
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from '@/components/ui/table';
 import { 
   Users, 
   Mail, 
   Activity,
   Search,
   Loader2,
   ExternalLink
 } from 'lucide-react';
 import { supabase } from '@/integrations/supabase/client';
 
 interface Client {
   id: string;
   clientId: string;
   clientName: string;
   email: string;
   phone: string;
   apiKey: string;
   totalEcgs: number;
   lastActivity: string | null;
   createdAt: string | null;
   status: string;
 }
 
 export function AdminClientsTable() {
   const [clients, setClients] = useState<Client[]>([]);
   const [filteredClients, setFilteredClients] = useState<Client[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
 
   useEffect(() => {
     fetchClients();
   }, []);
 
   useEffect(() => {
     if (searchQuery) {
       const query = searchQuery.toLowerCase();
       setFilteredClients(
         clients.filter(
           c =>
             c.clientName.toLowerCase().includes(query) ||
             c.email.toLowerCase().includes(query) ||
             c.clientId.toLowerCase().includes(query)
         )
       );
     } else {
       setFilteredClients(clients);
     }
   }, [searchQuery, clients]);
 
   const fetchClients = async () => {
     try {
       const response = await supabase.functions.invoke('mongodb-proxy', {
         body: { action: 'admin_get_all_clients', filters: {} }
       });
 
       if (response.data?.clients) {
         setClients(response.data.clients);
         setFilteredClients(response.data.clients);
       }
     } catch (error) {
       console.error('Error fetching clients:', error);
     } finally {
       setLoading(false);
     }
   };
 
   const formatDate = (dateStr: string | null) => {
     if (!dateStr) return 'N/A';
     return new Date(dateStr).toLocaleDateString('en-IN', {
       day: 'numeric',
       month: 'short',
       year: 'numeric',
     });
   };
 
   const getStatusBadge = (status: string) => {
     switch (status) {
       case 'active':
         return <Badge className="bg-green-500">Active</Badge>;
       case 'inactive':
         return <Badge variant="secondary">Inactive</Badge>;
       case 'suspended':
         return <Badge variant="destructive">Suspended</Badge>;
       default:
         return <Badge variant="outline">{status}</Badge>;
     }
   };
 
   return (
     <Card>
       <CardHeader>
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
             <CardTitle className="flex items-center gap-2">
               <Users className="h-5 w-5" />
               SDK Clients
             </CardTitle>
             <CardDescription>
               All registered SDK integration clients from MongoDB
             </CardDescription>
           </div>
           <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Search clients..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-9"
             />
           </div>
         </div>
       </CardHeader>
       <CardContent>
         {loading ? (
           <div className="flex justify-center py-8">
             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
           </div>
         ) : filteredClients.length > 0 ? (
           <div className="overflow-x-auto">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Client</TableHead>
                   <TableHead>Client ID</TableHead>
                   <TableHead>Contact</TableHead>
                   <TableHead className="text-right">ECGs</TableHead>
                   <TableHead>Last Activity</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead></TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredClients.map((client) => (
                   <TableRow key={client.id}>
                     <TableCell>
                       <div>
                         <p className="font-medium">{client.clientName}</p>
                         <p className="text-xs text-muted-foreground font-mono">
                           {client.apiKey}
                         </p>
                       </div>
                     </TableCell>
                     <TableCell className="font-mono text-sm">
                       {client.clientId}
                     </TableCell>
                     <TableCell>
                       <div className="space-y-1">
                         {client.email && (
                           <p className="text-sm">{client.email}</p>
                         )}
                         {client.phone && (
                           <p className="text-xs text-muted-foreground">{client.phone}</p>
                         )}
                       </div>
                     </TableCell>
                     <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-1">
                         <Activity className="h-3 w-3 text-muted-foreground" />
                         <span className="font-medium">{client.totalEcgs.toLocaleString()}</span>
                       </div>
                     </TableCell>
                     <TableCell>{formatDate(client.lastActivity)}</TableCell>
                     <TableCell>{getStatusBadge(client.status)}</TableCell>
                     <TableCell>
                       {client.email && (
                         <Button
                           variant="ghost"
                           size="sm"
                           asChild
                         >
                           <a 
                             href={`mailto:${client.email}?subject=Agatsa SDK Support`}
                             target="_blank"
                             rel="noopener noreferrer"
                           >
                             <Mail className="h-4 w-4 mr-1" />
                             Contact
                             <ExternalLink className="h-3 w-3 ml-1" />
                           </a>
                         </Button>
                       )}
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </div>
         ) : (
           <div className="text-center py-8 text-muted-foreground">
             <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
             <p>No clients found</p>
           </div>
         )}
       </CardContent>
     </Card>
   );
 }