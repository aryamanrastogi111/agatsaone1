 import { SDKLayout } from '@/components/sdk/SDKLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Textarea } from '@/components/ui/textarea';
 import { Label } from '@/components/ui/label';
 import { 
   HelpCircle, 
   Mail, 
   Phone,
   MessageSquare,
   ExternalLink
 } from 'lucide-react';
 
 export default function SDKSupport() {
   return (
     <SDKLayout>
       <div className="space-y-6">
         {/* Header */}
         <div>
           <h1 className="text-3xl font-bold">Support</h1>
           <p className="text-muted-foreground mt-1">
             Get help with SDK integration and technical questions
           </p>
         </div>
 
         <div className="grid gap-6 md:grid-cols-2">
           {/* Contact Options */}
           <div className="space-y-4">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Mail className="h-5 w-5" />
                   Email Support
                 </CardTitle>
                 <CardDescription>
                   For technical questions and integration support
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <p className="text-lg font-medium">sdk-support@agatsa.com</p>
                 <p className="text-sm text-muted-foreground mt-1">
                   Response within 24-48 hours
                 </p>
                 <Button className="mt-4" variant="outline" asChild>
                   <a href="mailto:sdk-support@agatsa.com">
                     <Mail className="h-4 w-4 mr-2" />
                     Send Email
                   </a>
                 </Button>
               </CardContent>
             </Card>
 
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Phone className="h-5 w-5" />
                   Phone Support
                 </CardTitle>
                 <CardDescription>
                   For urgent issues and enterprise customers
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <p className="text-lg font-medium">+91 11 4151 8989</p>
                 <p className="text-sm text-muted-foreground mt-1">
                   Mon-Fri, 9:00 AM - 6:00 PM IST
                 </p>
                 <Button className="mt-4" variant="outline" asChild>
                   <a href="tel:+911141518989">
                     <Phone className="h-4 w-4 mr-2" />
                     Call Now
                   </a>
                 </Button>
               </CardContent>
             </Card>
           </div>
 
           {/* Contact Form */}
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <MessageSquare className="h-5 w-5" />
                 Send a Message
               </CardTitle>
               <CardDescription>
                 Describe your issue and we'll get back to you
               </CardDescription>
             </CardHeader>
             <CardContent>
               <form className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="subject">Subject</Label>
                   <Input id="subject" placeholder="What do you need help with?" />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="message">Message</Label>
                   <Textarea 
                     id="message" 
                     placeholder="Describe your issue in detail..."
                     rows={5}
                   />
                 </div>
                 <Button type="submit" className="w-full">
                   Submit Request
                 </Button>
               </form>
             </CardContent>
           </Card>
         </div>
 
         {/* FAQ Section */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <HelpCircle className="h-5 w-5" />
               Frequently Asked Questions
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-6">
               <div>
                 <h4 className="font-semibold mb-1">How do I get API credentials?</h4>
                 <p className="text-sm text-muted-foreground">
                   After registering your device, API credentials are automatically generated. 
                   You can find them in the Downloads section of your dashboard.
                 </p>
               </div>
               <div>
                 <h4 className="font-semibold mb-1">Which platforms are supported?</h4>
                 <p className="text-sm text-muted-foreground">
                   We provide native SDKs for Android (API 21+) and iOS (12.0+). 
                   Both platforms support Bluetooth LE connectivity.
                 </p>
               </div>
               <div>
                 <h4 className="font-semibold mb-1">How do ECG credits work?</h4>
                 <p className="text-sm text-muted-foreground">
                   Each ECG recording consumes one credit. Credits are purchased in packs 
                   and can be recharged anytime from the Credits section.
                 </p>
               </div>
               <div>
                 <h4 className="font-semibold mb-1">Can I test without a physical device?</h4>
                 <p className="text-sm text-muted-foreground">
                   Yes, our SDK includes a simulator mode for development. 
                   Enable it by calling SDK.enableSimulator() during initialization.
                 </p>
               </div>
             </div>
           </CardContent>
         </Card>
       </div>
     </SDKLayout>
   );
 }