 import { Link } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { 
   Heart, 
   Activity, 
   Scale, 
   ArrowRight, 
   Shield, 
   Code, 
   Smartphone, 
   CheckCircle,
   Zap,
   Users,
   Clock,
   Settings
 } from 'lucide-react';
 import { Header } from '@/components/layout/Header';
 import { Footer } from '@/components/layout/Footer';
 import agatsaLogo from '@/assets/agatsa-logo.png';
 
 const sdkProducts = [
   {
     id: 'sanketlife',
     name: 'SanketLife SDK',
     description: 'Integrate medical-grade 12-lead ECG capabilities into your health applications.',
     icon: Heart,
     features: [
       '12-lead ECG recording',
       'Real-time heart rate monitoring',
       'Arrhythmia detection alerts',
       'ECG report generation',
     ],
     color: 'text-red-500',
     bgColor: 'bg-red-500/10',
   },
   {
     id: 'corebalance',
     name: 'CoreBalance SDK',
     description: 'Add comprehensive body composition analysis to your fitness and wellness apps.',
     icon: Scale,
     features: [
       '10+ body composition metrics',
       'BMI & BMR calculations',
       'Muscle mass analysis',
       'Body fat percentage',
     ],
     color: 'text-blue-500',
     bgColor: 'bg-blue-500/10',
   },
   {
     id: 'health360',
     name: 'Health 360 SDK',
     description: 'Complete health monitoring solution with multi-device integration support.',
     icon: Activity,
     features: [
       'Unified health dashboard',
       'Multi-device data sync',
       'Trend analysis',
       'Custom health reports',
     ],
     color: 'text-green-500',
     bgColor: 'bg-green-500/10',
   },
 ];
 
 const stats = [
   { value: '500+', label: 'Devices Deployed', icon: Smartphone },
   { value: '99.9%', label: 'API Uptime', icon: Zap },
   { value: '50+', label: 'Enterprise Partners', icon: Users },
   { value: '24/7', label: 'Support Available', icon: Clock },
 ];
 
 export default function SDKLanding() {
   return (
     <div className="min-h-screen bg-background flex flex-col">
       <Header />
       
       <main className="flex-1">
         {/* Hero Section */}
         <section className="relative py-20 md:py-32 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
           <div className="container relative mx-auto px-4 md:px-6">
             <div className="max-w-4xl mx-auto text-center">
               <Badge variant="secondary" className="mb-4">
                 <Code className="h-3 w-3 mr-1" />
                 Developer Portal
               </Badge>
               <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                 Build Health-Tech Apps with{' '}
                 <span className="text-primary">Agatsa SDK</span>
               </h1>
               <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                 Integrate medical-grade ECG, body composition analysis, and comprehensive 
                 health tracking into your applications with our easy-to-use SDKs.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button asChild size="lg" className="text-lg px-8">
                   <Link to="/sdk/auth?mode=register">
                     Get Started Free
                     <ArrowRight className="ml-2 h-5 w-5" />
                   </Link>
                 </Button>
                 <Button asChild variant="outline" size="lg" className="text-lg px-8">
                   <Link to="/sdk/auth">
                     Sign In
                   </Link>
                 </Button>
               </div>
                {/* Temporary Admin Link */}
                <div className="mt-6 pt-6 border-t border-dashed border-muted-foreground/30">
                  <Link 
                    to="/sdk/admin" 
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Admin Panel (Temporary Access)
                  </Link>
                </div>
             </div>
           </div>
         </section>
 
         {/* Stats Section */}
         <section className="py-12 border-y bg-muted/30">
           <div className="container mx-auto px-4 md:px-6">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {stats.map((stat, index) => (
                 <div key={index} className="text-center">
                   <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                   <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                   <div className="text-sm text-muted-foreground">{stat.label}</div>
                 </div>
               ))}
             </div>
           </div>
         </section>
 
         {/* SDK Products Section */}
         <section className="py-20 md:py-28">
           <div className="container mx-auto px-4 md:px-6">
             <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your SDK</h2>
               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                 Powerful, well-documented SDKs for Android and iOS platforms. 
                 Start building in minutes.
               </p>
             </div>
             
             <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
               {sdkProducts.map((product) => (
                 <Card key={product.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                   <CardHeader>
                     <div className={`w-12 h-12 rounded-lg ${product.bgColor} flex items-center justify-center mb-4`}>
                       <product.icon className={`h-6 w-6 ${product.color}`} />
                     </div>
                     <CardTitle className="text-xl">{product.name}</CardTitle>
                     <CardDescription>{product.description}</CardDescription>
                   </CardHeader>
                   <CardContent>
                     <ul className="space-y-2">
                       {product.features.map((feature, index) => (
                         <li key={index} className="flex items-center gap-2 text-sm">
                           <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                           <span>{feature}</span>
                         </li>
                       ))}
                     </ul>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </div>
         </section>
 
         {/* Features Section */}
         <section className="py-20 md:py-28 bg-muted/30">
           <div className="container mx-auto px-4 md:px-6">
             <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Agatsa SDK?</h2>
               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                 Built by healthcare experts, trusted by developers worldwide.
               </p>
             </div>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
               <div className="flex gap-4">
                 <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                   <Shield className="h-5 w-5 text-primary" />
                 </div>
                 <div>
                   <h3 className="font-semibold mb-1">Medical-Grade Accuracy</h3>
                   <p className="text-sm text-muted-foreground">
                     CE certified devices with clinical-grade accuracy for professional use.
                   </p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                   <Code className="h-5 w-5 text-primary" />
                 </div>
                 <div>
                   <h3 className="font-semibold mb-1">Easy Integration</h3>
                   <p className="text-sm text-muted-foreground">
                     Well-documented APIs with sample code for quick implementation.
                   </p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                   <Smartphone className="h-5 w-5 text-primary" />
                 </div>
                 <div>
                   <h3 className="font-semibold mb-1">Cross-Platform</h3>
                   <p className="text-sm text-muted-foreground">
                     Native SDKs for both Android and iOS with consistent APIs.
                   </p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                   <Users className="h-5 w-5 text-primary" />
                 </div>
                 <div>
                   <h3 className="font-semibold mb-1">Developer Support</h3>
                   <p className="text-sm text-muted-foreground">
                     Dedicated support team to help you integrate successfully.
                   </p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                   <Zap className="h-5 w-5 text-primary" />
                 </div>
                 <div>
                   <h3 className="font-semibold mb-1">Real-Time Data</h3>
                   <p className="text-sm text-muted-foreground">
                     Live data streaming with low latency for instant readings.
                   </p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                   <Clock className="h-5 w-5 text-primary" />
                 </div>
                 <div>
                   <h3 className="font-semibold mb-1">Quick Setup</h3>
                   <p className="text-sm text-muted-foreground">
                     Get started in under 30 minutes with our quickstart guides.
                   </p>
                 </div>
               </div>
             </div>
           </div>
         </section>
 
         {/* CTA Section */}
         <section className="py-20 md:py-28">
           <div className="container mx-auto px-4 md:px-6">
             <Card className="max-w-3xl mx-auto bg-primary text-primary-foreground">
               <CardContent className="p-8 md:p-12 text-center">
                 <h2 className="text-3xl md:text-4xl font-bold mb-4">
                   Ready to Get Started?
                 </h2>
                 <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
                   Create your free developer account today and start building 
                   health-tech applications with Agatsa SDK.
                 </p>
                 <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                   <Link to="/sdk/auth?mode=register">
                     Create Free Account
                     <ArrowRight className="ml-2 h-5 w-5" />
                   </Link>
                 </Button>
               </CardContent>
             </Card>
           </div>
         </section>
       </main>
 
       <Footer />
     </div>
   );
 }