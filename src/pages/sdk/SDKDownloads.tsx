 import { SDKLayout } from '@/components/sdk/SDKLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { 
   Download, 
   Heart, 
   Scale, 
   Activity,
   FileText,
   Code,
   ExternalLink
 } from 'lucide-react';
 
 const sdkProducts = [
   {
     id: 'sanketlife',
     name: 'SanketLife SDK',
     description: '12-lead ECG monitoring and analysis',
     icon: Heart,
     color: 'text-red-500',
     bgColor: 'bg-red-500/10',
     version: '3.2.1',
     lastUpdated: '2025-01-15',
     downloads: {
       android: {
         label: 'Android SDK',
         file: 'sanketlife-sdk-android-3.2.1.aar',
         size: '4.2 MB',
       },
       ios: {
         label: 'iOS SDK',
         file: 'SanketLifeSDK.xcframework',
         size: '5.8 MB',
       },
       docs: {
         label: 'API Documentation',
         file: 'sanketlife-api-docs.pdf',
         size: '1.2 MB',
       },
       sample: {
         label: 'Sample Project',
         url: '#',
       },
     },
   },
   {
     id: 'corebalance',
     name: 'CoreBalance SDK',
     description: 'Body composition analysis',
     icon: Scale,
     color: 'text-blue-500',
     bgColor: 'bg-blue-500/10',
     version: '2.1.0',
     lastUpdated: '2025-01-20',
     downloads: {
       android: {
         label: 'Android SDK',
         file: 'corebalance-sdk-android-2.1.0.aar',
         size: '3.1 MB',
       },
       ios: {
         label: 'iOS SDK',
         file: 'CoreBalanceSDK.xcframework',
         size: '4.2 MB',
       },
       docs: {
         label: 'API Documentation',
         file: 'corebalance-api-docs.pdf',
         size: '800 KB',
       },
       sample: {
         label: 'Sample Project',
         url: '#',
       },
     },
   },
   {
     id: 'health360',
     name: 'Health 360 SDK',
     description: 'Comprehensive health tracking',
     icon: Activity,
     color: 'text-green-500',
     bgColor: 'bg-green-500/10',
     version: '1.5.0',
     lastUpdated: '2025-02-01',
     downloads: {
       android: {
         label: 'Android SDK',
         file: 'health360-sdk-android-1.5.0.aar',
         size: '2.8 MB',
       },
       ios: {
         label: 'iOS SDK',
         file: 'Health360SDK.xcframework',
         size: '3.5 MB',
       },
       docs: {
         label: 'API Documentation',
         file: 'health360-api-docs.pdf',
         size: '950 KB',
       },
       sample: {
         label: 'Sample Project',
         url: '#',
       },
     },
   },
 ];
 
 export default function SDKDownloads() {
   const handleDownload = (filename: string) => {
     // In production, this would trigger actual file download
     console.log('Downloading:', filename);
   };
 
   return (
     <SDKLayout>
       <div className="space-y-6">
         {/* Header */}
         <div>
           <h1 className="text-3xl font-bold">SDK Downloads</h1>
           <p className="text-muted-foreground mt-1">
             Download SDKs, documentation, and sample projects
           </p>
         </div>
 
         {/* SDK Tabs */}
         <Tabs defaultValue="sanketlife">
           <TabsList className="mb-6">
             {sdkProducts.map((product) => (
               <TabsTrigger key={product.id} value={product.id} className="gap-2">
                 <product.icon className={`h-4 w-4 ${product.color}`} />
                 <span className="hidden sm:inline">{product.name.replace(' SDK', '')}</span>
               </TabsTrigger>
             ))}
           </TabsList>
 
           {sdkProducts.map((product) => (
             <TabsContent key={product.id} value={product.id}>
               <div className="grid gap-6">
                 {/* Product Header */}
                 <Card>
                   <CardHeader>
                     <div className="flex items-start justify-between">
                       <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-lg ${product.bgColor}`}>
                           <product.icon className={`h-6 w-6 ${product.color}`} />
                         </div>
                         <div>
                           <CardTitle>{product.name}</CardTitle>
                           <CardDescription>{product.description}</CardDescription>
                         </div>
                       </div>
                       <Badge variant="secondary">v{product.version}</Badge>
                     </div>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-muted-foreground">
                       Last updated: {new Date(product.lastUpdated).toLocaleDateString('en-IN', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric',
                       })}
                     </p>
                   </CardContent>
                 </Card>
 
                 {/* Downloads Grid */}
                 <div className="grid gap-4 md:grid-cols-2">
                   {/* Android SDK */}
                   <Card>
                     <CardHeader className="pb-2">
                       <div className="flex items-center gap-2">
                         <div className="p-2 rounded-lg bg-green-500/10">
                           <Code className="h-4 w-4 text-green-500" />
                         </div>
                         <div>
                           <CardTitle className="text-base">{product.downloads.android.label}</CardTitle>
                           <CardDescription className="text-xs">
                             {product.downloads.android.file}
                           </CardDescription>
                         </div>
                       </div>
                     </CardHeader>
                     <CardContent>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-muted-foreground">
                           {product.downloads.android.size}
                         </span>
                         <Button size="sm" onClick={() => handleDownload(product.downloads.android.file)}>
                           <Download className="h-4 w-4 mr-2" />
                           Download
                         </Button>
                       </div>
                     </CardContent>
                   </Card>
 
                   {/* iOS SDK */}
                   <Card>
                     <CardHeader className="pb-2">
                       <div className="flex items-center gap-2">
                         <div className="p-2 rounded-lg bg-gray-500/10">
                           <Code className="h-4 w-4 text-gray-500" />
                         </div>
                         <div>
                           <CardTitle className="text-base">{product.downloads.ios.label}</CardTitle>
                           <CardDescription className="text-xs">
                             {product.downloads.ios.file}
                           </CardDescription>
                         </div>
                       </div>
                     </CardHeader>
                     <CardContent>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-muted-foreground">
                           {product.downloads.ios.size}
                         </span>
                         <Button size="sm" onClick={() => handleDownload(product.downloads.ios.file)}>
                           <Download className="h-4 w-4 mr-2" />
                           Download
                         </Button>
                       </div>
                     </CardContent>
                   </Card>
 
                   {/* Documentation */}
                   <Card>
                     <CardHeader className="pb-2">
                       <div className="flex items-center gap-2">
                         <div className="p-2 rounded-lg bg-blue-500/10">
                           <FileText className="h-4 w-4 text-blue-500" />
                         </div>
                         <div>
                           <CardTitle className="text-base">{product.downloads.docs.label}</CardTitle>
                           <CardDescription className="text-xs">
                             {product.downloads.docs.file}
                           </CardDescription>
                         </div>
                       </div>
                     </CardHeader>
                     <CardContent>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-muted-foreground">
                           {product.downloads.docs.size}
                         </span>
                         <Button size="sm" variant="outline" onClick={() => handleDownload(product.downloads.docs.file)}>
                           <Download className="h-4 w-4 mr-2" />
                           Download
                         </Button>
                       </div>
                     </CardContent>
                   </Card>
 
                   {/* Sample Project */}
                   <Card>
                     <CardHeader className="pb-2">
                       <div className="flex items-center gap-2">
                         <div className="p-2 rounded-lg bg-purple-500/10">
                           <Code className="h-4 w-4 text-purple-500" />
                         </div>
                         <div>
                           <CardTitle className="text-base">{product.downloads.sample.label}</CardTitle>
                           <CardDescription className="text-xs">
                             GitHub Repository
                           </CardDescription>
                         </div>
                       </div>
                     </CardHeader>
                     <CardContent>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-muted-foreground">
                           View source code
                         </span>
                         <Button size="sm" variant="outline">
                           <ExternalLink className="h-4 w-4 mr-2" />
                           View
                         </Button>
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               </div>
             </TabsContent>
           ))}
         </Tabs>
       </div>
     </SDKLayout>
   );
 }