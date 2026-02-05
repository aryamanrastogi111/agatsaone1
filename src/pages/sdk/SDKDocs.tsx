 import { SDKLayout } from '@/components/sdk/SDKLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { 
   FileText, 
   Code, 
   Smartphone,
   BookOpen,
   ExternalLink
 } from 'lucide-react';
 
 export default function SDKDocs() {
   return (
     <SDKLayout>
       <div className="space-y-6">
         {/* Header */}
         <div>
           <h1 className="text-3xl font-bold">Documentation</h1>
           <p className="text-muted-foreground mt-1">
             Guides, API reference, and integration tutorials
           </p>
         </div>
 
         <Tabs defaultValue="quickstart">
           <TabsList>
             <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
             <TabsTrigger value="android">Android</TabsTrigger>
             <TabsTrigger value="ios">iOS</TabsTrigger>
             <TabsTrigger value="api">API Reference</TabsTrigger>
           </TabsList>
 
           <TabsContent value="quickstart" className="mt-6">
             <div className="grid gap-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <BookOpen className="h-5 w-5" />
                     Getting Started
                   </CardTitle>
                   <CardDescription>
                     Follow these steps to integrate Agatsa SDK into your application
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                   <h3>Prerequisites</h3>
                   <ul>
                     <li>An Agatsa developer account (register at the SDK Portal)</li>
                     <li>A registered Agatsa device (SanketLife, CoreBalance, or Health 360)</li>
                     <li>Android Studio 4.0+ or Xcode 12+</li>
                   </ul>
 
                   <h3>Step 1: Download the SDK</h3>
                   <p>
                     Navigate to the Downloads section and download the appropriate SDK for your platform.
                   </p>
 
                   <h3>Step 2: Add to Your Project</h3>
                   <p>
                     <strong>Android:</strong> Add the .aar file to your project's libs folder and include it in your build.gradle.
                   </p>
                   <p>
                     <strong>iOS:</strong> Add the .xcframework to your Xcode project or use CocoaPods.
                   </p>
 
                   <h3>Step 3: Initialize the SDK</h3>
                   <p>
                     Initialize the SDK with your API credentials in your application's entry point.
                   </p>
 
                   <h3>Step 4: Connect to Device</h3>
                   <p>
                     Use the SDK's Bluetooth scanning methods to discover and connect to your Agatsa device.
                   </p>
                 </CardContent>
               </Card>
             </div>
           </TabsContent>
 
           <TabsContent value="android" className="mt-6">
             <div className="grid gap-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Smartphone className="h-5 w-5 text-green-500" />
                     Android Integration
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                   <h3>Requirements</h3>
                   <ul>
                     <li>Android SDK 21+ (Android 5.0 Lollipop)</li>
                     <li>Bluetooth LE support</li>
                     <li>BLUETOOTH_CONNECT and BLUETOOTH_SCAN permissions</li>
                   </ul>
 
                   <h3>Installation</h3>
                   <p>Add the SDK to your app-level build.gradle:</p>
                   <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                     <code>{`dependencies {
     implementation files('libs/sanketlife-sdk.aar')
 }`}</code>
                   </pre>
 
                   <h3>Permissions</h3>
                   <p>Add required permissions to AndroidManifest.xml:</p>
                   <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                     <code>{`<uses-permission android:name="android.permission.BLUETOOTH" />
 <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
 <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
 <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
 <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />`}</code>
                   </pre>
 
                   <h3>Initialization</h3>
                   <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                     <code>{`// Initialize in Application class
 SanketLifeSDK.initialize(context, "YOUR_API_KEY");
 
 // Start scanning for devices
 SanketLifeSDK.startScan(new ScanCallback() {
     @Override
     public void onDeviceFound(SanketDevice device) {
         // Handle discovered device
     }
 });`}</code>
                   </pre>
                 </CardContent>
               </Card>
             </div>
           </TabsContent>
 
           <TabsContent value="ios" className="mt-6">
             <div className="grid gap-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Smartphone className="h-5 w-5 text-gray-500" />
                     iOS Integration
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                   <h3>Requirements</h3>
                   <ul>
                     <li>iOS 12.0+</li>
                     <li>Swift 5.0+</li>
                     <li>CoreBluetooth framework</li>
                   </ul>
 
                   <h3>Installation via CocoaPods</h3>
                   <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                     <code>{`pod 'SanketLifeSDK', '~> 3.2'`}</code>
                   </pre>
 
                   <h3>Info.plist Configuration</h3>
                   <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                     <code>{`<key>NSBluetoothAlwaysUsageDescription</key>
 <string>This app uses Bluetooth to connect to your health device.</string>
 <key>NSBluetoothPeripheralUsageDescription</key>
 <string>This app uses Bluetooth to connect to your health device.</string>`}</code>
                   </pre>
 
                   <h3>Initialization</h3>
                   <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                     <code>{`import SanketLifeSDK
 
 // Initialize in AppDelegate
 SanketLifeSDK.shared.initialize(apiKey: "YOUR_API_KEY")
 
 // Start scanning
 SanketLifeSDK.shared.startScan { device in
     print("Found device: \\(device.name)")
 }`}</code>
                   </pre>
                 </CardContent>
               </Card>
             </div>
           </TabsContent>
 
           <TabsContent value="api" className="mt-6">
             <div className="grid gap-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Code className="h-5 w-5" />
                     API Reference
                   </CardTitle>
                   <CardDescription>
                     Core SDK methods and callbacks
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-6">
                     <div>
                       <h4 className="font-semibold mb-2">initialize()</h4>
                       <p className="text-sm text-muted-foreground mb-2">
                         Initialize the SDK with your API credentials. Must be called before any other SDK methods.
                       </p>
                       <Badge variant="secondary">Required</Badge>
                     </div>
 
                     <div>
                       <h4 className="font-semibold mb-2">startScan(callback)</h4>
                       <p className="text-sm text-muted-foreground mb-2">
                         Start Bluetooth scanning for nearby Agatsa devices.
                       </p>
                       <Badge variant="outline">Bluetooth</Badge>
                     </div>
 
                     <div>
                       <h4 className="font-semibold mb-2">connect(device)</h4>
                       <p className="text-sm text-muted-foreground mb-2">
                         Establish connection with a discovered device.
                       </p>
                       <Badge variant="outline">Bluetooth</Badge>
                     </div>
 
                     <div>
                       <h4 className="font-semibold mb-2">startECG(callback)</h4>
                       <p className="text-sm text-muted-foreground mb-2">
                         Begin ECG recording session. Streams real-time data via callback.
                       </p>
                       <Badge variant="outline">SanketLife</Badge>
                     </div>
 
                     <div>
                       <h4 className="font-semibold mb-2">getBodyComposition()</h4>
                       <p className="text-sm text-muted-foreground mb-2">
                         Get body composition metrics from CoreBalance device.
                       </p>
                       <Badge variant="outline">CoreBalance</Badge>
                     </div>
 
                     <div>
                       <h4 className="font-semibold mb-2">disconnect()</h4>
                       <p className="text-sm text-muted-foreground mb-2">
                         Safely disconnect from the currently connected device.
                       </p>
                       <Badge variant="outline">Bluetooth</Badge>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             </div>
           </TabsContent>
         </Tabs>
       </div>
     </SDKLayout>
   );
 }