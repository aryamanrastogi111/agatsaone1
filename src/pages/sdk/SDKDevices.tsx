 import { useState, useEffect } from 'react';
 import { SDKLayout } from '@/components/sdk/SDKLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Badge } from '@/components/ui/badge';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { 
   Smartphone, 
   Search, 
   Filter, 
   Activity,
   Heart,
   Scale,
   RefreshCw,
   Plus,
   Loader2
 } from 'lucide-react';
 import { supabase } from '@/integrations/supabase/client';
 import { toast } from 'sonner';
 
 interface Device {
   id: string;
   serial: string;
   productType: string;
   activatedAt: string;
   ecgCount: number;
   lastSync: string;
   status: string;
   username?: string;
 }
 
 const productTypeConfig = {
   sanketlife: { 
     label: 'SanketLife', 
     icon: Heart, 
     color: 'text-red-500', 
     bgColor: 'bg-red-500/10' 
   },
   corebalance: { 
     label: 'CoreBalance', 
     icon: Scale, 
     color: 'text-blue-500', 
     bgColor: 'bg-blue-500/10' 
   },
   health360: { 
     label: 'Health 360', 
     icon: Activity, 
     color: 'text-green-500', 
     bgColor: 'bg-green-500/10' 
   },
 };
 
 export default function SDKDevices() {
   const [searchQuery, setSearchQuery] = useState('');
   const [filterType, setFilterType] = useState<string>('all');
   const [loading, setLoading] = useState(false);
   const [devices, setDevices] = useState<Device[]>([]);
   const [clientInfo, setClientInfo] = useState<{ name: string; clientId: string } | null>(null);
 
   useEffect(() => {
     fetchDevices();
   }, []);
 
   const fetchDevices = async () => {
     setLoading(true);
     try {
       const { data: { session } } = await supabase.auth.getSession();
       if (!session) {
         toast.error('Please log in to view devices');
         return;
       }
 
       const { data, error } = await supabase.functions.invoke('mongodb-proxy', {
         body: {
           action: 'get_devices',
           filters: { productType: filterType }
         }
       });
 
       if (error) throw error;
 
       setDevices(data.devices || []);
       setClientInfo(data.clientInfo || null);
     } catch (error: any) {
       console.error('Error fetching devices:', error);
       toast.error(error.message || 'Failed to fetch devices');
     } finally {
       setLoading(false);
     }
   };
 
   const filteredDevices = devices.filter((device) => {
     const matchesSearch = device.serial.toLowerCase().includes(searchQuery.toLowerCase());
     const matchesFilter = filterType === 'all' || device.productType === filterType;
     return matchesSearch && matchesFilter;
   });
 
   const formatDate = (dateString: string) => {
     return new Date(dateString).toLocaleDateString('en-IN', {
       year: 'numeric',
       month: 'short',
       day: 'numeric',
     });
   };
 
   const formatLastSync = (dateString: string) => {
     const date = new Date(dateString);
     const now = new Date();
     const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
     
     if (diffHours < 24) {
       return `${diffHours} hours ago`;
     } else {
       const diffDays = Math.floor(diffHours / 24);
       return `${diffDays} days ago`;
     }
   };
 
   return (
     <SDKLayout>
       <div className="space-y-6">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
             <h1 className="text-3xl font-bold">My Devices</h1>
             <p className="text-muted-foreground mt-1">
               View and manage your registered devices
               {clientInfo && (
                 <span className="ml-2 text-sm">
                   • Client: <span className="font-medium">{clientInfo.name}</span>
                 </span>
               )}
             </p>
           </div>
           <Button>
             <Plus className="h-4 w-4 mr-2" />
             Register Device
           </Button>
         </div>
 
         {/* Filters */}
         <Card>
           <CardContent className="p-4">
             <div className="flex flex-col md:flex-row gap-4">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   placeholder="Search by serial number..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-9"
                 />
               </div>
               <Select value={filterType} onValueChange={setFilterType}>
                 <SelectTrigger className="w-full md:w-[200px]">
                   <Filter className="h-4 w-4 mr-2" />
                   <SelectValue placeholder="Filter by type" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Products</SelectItem>
                   <SelectItem value="sanketlife">SanketLife</SelectItem>
                   <SelectItem value="corebalance">CoreBalance</SelectItem>
                   <SelectItem value="health360">Health 360</SelectItem>
                 </SelectContent>
               </Select>
             <Button variant="outline" disabled={loading} onClick={fetchDevices}>
               <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                 Refresh
               </Button>
             </div>
           </CardContent>
         </Card>
 
         {/* Devices Grid */}
         {loading ? (
           <Card>
             <CardContent className="flex flex-col items-center justify-center py-12">
               <Loader2 className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
               <h3 className="text-lg font-medium">Loading devices...</h3>
               <p className="text-sm text-muted-foreground text-center mt-1">
                 Fetching data from MongoDB
               </p>
             </CardContent>
           </Card>
         ) : filteredDevices.length > 0 ? (
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {filteredDevices.map((device) => {
               const config = productTypeConfig[device.productType as keyof typeof productTypeConfig];
               const IconComponent = config.icon;
               
               return (
                 <Card key={device.id} className="hover:shadow-md transition-shadow">
                   <CardHeader className="pb-2">
                     <div className="flex items-start justify-between">
                       <div className={`p-2 rounded-lg ${config.bgColor}`}>
                         <IconComponent className={`h-5 w-5 ${config.color}`} />
                       </div>
                       <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
                         {device.status}
                       </Badge>
                     </div>
                     <CardTitle className="text-lg mt-2">{device.serial}</CardTitle>
                     <CardDescription>{config.label}</CardDescription>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-2 text-sm">
                       <div className="flex justify-between">
                         <span className="text-muted-foreground">Activated</span>
                         <span>{formatDate(device.activatedAt)}</span>
                       </div>
                       {device.productType === 'sanketlife' && (
                         <div className="flex justify-between">
                           <span className="text-muted-foreground">ECG Count</span>
                           <span className="font-medium">{device.ecgCount}</span>
                         </div>
                       )}
                       <div className="flex justify-between">
                         <span className="text-muted-foreground">Last Sync</span>
                         <span>{formatLastSync(device.lastSync)}</span>
                       </div>
                     </div>
                     <Button variant="outline" className="w-full mt-4" size="sm">
                       View Details
                     </Button>
                   </CardContent>
                 </Card>
               );
             })}
           </div>
         ) : (
           <Card>
             <CardContent className="flex flex-col items-center justify-center py-12">
               <Smartphone className="h-12 w-12 text-muted-foreground mb-4" />
               <h3 className="text-lg font-medium">No devices found</h3>
               <p className="text-sm text-muted-foreground text-center mt-1">
                 {searchQuery || filterType !== 'all'
                   ? 'Try adjusting your search or filters'
                   : 'Register your first device to get started'}
               </p>
               {!searchQuery && filterType === 'all' && (
                 <Button className="mt-4">
                   <Plus className="h-4 w-4 mr-2" />
                   Register Device
                 </Button>
               )}
             </CardContent>
           </Card>
         )}
       </div>
     </SDKLayout>
   );
 }