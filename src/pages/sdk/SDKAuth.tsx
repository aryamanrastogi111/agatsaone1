 import { useState, useEffect } from 'react';
 import { useNavigate, useSearchParams } from 'react-router-dom';
 import { useAuth } from '@/hooks/useAuth';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
 import { Link } from 'react-router-dom';
 import { z } from 'zod';
 import agatsaLogo from '@/assets/agatsa-logo.png';
 
 const loginSchema = z.object({
   email: z.string().email('Please enter a valid email address'),
   password: z.string().min(6, 'Password must be at least 6 characters'),
 });
 
 const signupSchema = z.object({
   email: z.string().email('Please enter a valid email address'),
   password: z.string().min(8, 'Password must be at least 8 characters'),
   fullName: z.string().min(2, 'Full name is required'),
   companyName: z.string().optional(),
   phone: z.string().optional(),
 });
 
 export default function SDKAuth() {
   const { user, loading, signIn, signUp, resetPassword } = useAuth();
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const mode = searchParams.get('mode');
   
   const [activeTab, setActiveTab] = useState<'login' | 'register'>(mode === 'register' ? 'register' : 'login');
   const [showPassword, setShowPassword] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showForgotPassword, setShowForgotPassword] = useState(false);
   const [errors, setErrors] = useState<Record<string, string>>({});
   
   // Login form state
   const [loginEmail, setLoginEmail] = useState('');
   const [loginPassword, setLoginPassword] = useState('');
   
   // Register form state
   const [registerEmail, setRegisterEmail] = useState('');
   const [registerPassword, setRegisterPassword] = useState('');
   const [fullName, setFullName] = useState('');
   const [companyName, setCompanyName] = useState('');
   const [phone, setPhone] = useState('');
   
   // Forgot password state
   const [resetEmail, setResetEmail] = useState('');
 
   useEffect(() => {
     if (user && !loading) {
       navigate('/sdk/dashboard');
     }
   }, [user, loading, navigate]);
 
   const handleLogin = async (e: React.FormEvent) => {
     e.preventDefault();
     setErrors({});
     
     try {
       loginSchema.parse({ email: loginEmail, password: loginPassword });
     } catch (err) {
       if (err instanceof z.ZodError) {
         const fieldErrors: Record<string, string> = {};
         err.errors.forEach((error) => {
           if (error.path[0]) {
             fieldErrors[error.path[0] as string] = error.message;
           }
         });
         setErrors(fieldErrors);
         return;
       }
     }
     
     setIsSubmitting(true);
     await signIn(loginEmail, loginPassword);
     setIsSubmitting(false);
   };
 
   const handleRegister = async (e: React.FormEvent) => {
     e.preventDefault();
     setErrors({});
     
     try {
       signupSchema.parse({
         email: registerEmail,
         password: registerPassword,
         fullName,
         companyName,
         phone,
       });
     } catch (err) {
       if (err instanceof z.ZodError) {
         const fieldErrors: Record<string, string> = {};
         err.errors.forEach((error) => {
           if (error.path[0]) {
             fieldErrors[error.path[0] as string] = error.message;
           }
         });
         setErrors(fieldErrors);
         return;
       }
     }
     
     setIsSubmitting(true);
     await signUp(registerEmail, registerPassword, fullName, companyName, phone);
     setIsSubmitting(false);
   };
 
   const handleForgotPassword = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!resetEmail) {
       setErrors({ resetEmail: 'Please enter your email address' });
       return;
     }
     
     setIsSubmitting(true);
     await resetPassword(resetEmail);
     setIsSubmitting(false);
     setShowForgotPassword(false);
   };
 
   if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
       {/* Header */}
       <header className="p-4 md:p-6">
         <Link to="/sdk" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
           <ArrowLeft className="h-4 w-4" />
           <span>Back to SDK Portal</span>
         </Link>
       </header>
 
       {/* Main Content */}
       <div className="flex-1 flex items-center justify-center p-4 md:p-8">
         <div className="w-full max-w-md">
           {/* Logo */}
           <div className="text-center mb-8">
             <Link to="/">
               <img src={agatsaLogo} alt="Agatsa" className="h-10 mx-auto mb-4" />
             </Link>
             <h1 className="text-2xl font-bold text-foreground">SDK Developer Portal</h1>
             <p className="text-muted-foreground mt-1">Access SDKs, documentation, and manage your devices</p>
           </div>
 
           {showForgotPassword ? (
             <Card>
               <CardHeader>
                 <CardTitle>Reset Password</CardTitle>
                 <CardDescription>
                   Enter your email address and we'll send you a link to reset your password.
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <form onSubmit={handleForgotPassword} className="space-y-4">
                   <div className="space-y-2">
                     <Label htmlFor="reset-email">Email</Label>
                     <Input
                       id="reset-email"
                       type="email"
                       placeholder="you@company.com"
                       value={resetEmail}
                       onChange={(e) => setResetEmail(e.target.value)}
                     />
                     {errors.resetEmail && (
                       <p className="text-sm text-destructive">{errors.resetEmail}</p>
                     )}
                   </div>
                   <div className="flex gap-2">
                     <Button
                       type="button"
                       variant="outline"
                       className="flex-1"
                       onClick={() => setShowForgotPassword(false)}
                     >
                       Back
                     </Button>
                     <Button type="submit" className="flex-1" disabled={isSubmitting}>
                       {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                       Send Reset Link
                     </Button>
                   </div>
                 </form>
               </CardContent>
             </Card>
           ) : (
             <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
               <TabsList className="grid w-full grid-cols-2 mb-6">
                 <TabsTrigger value="login">Sign In</TabsTrigger>
                 <TabsTrigger value="register">Register</TabsTrigger>
               </TabsList>
 
               <TabsContent value="login">
                 <Card>
                   <CardHeader>
                     <CardTitle>Welcome Back</CardTitle>
                     <CardDescription>
                       Sign in to access your SDK dashboard
                     </CardDescription>
                   </CardHeader>
                   <CardContent>
                     <form onSubmit={handleLogin} className="space-y-4">
                       <div className="space-y-2">
                         <Label htmlFor="login-email">Email</Label>
                         <Input
                           id="login-email"
                           type="email"
                           placeholder="you@company.com"
                           value={loginEmail}
                           onChange={(e) => setLoginEmail(e.target.value)}
                         />
                         {errors.email && (
                           <p className="text-sm text-destructive">{errors.email}</p>
                         )}
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="login-password">Password</Label>
                         <div className="relative">
                           <Input
                             id="login-password"
                             type={showPassword ? 'text' : 'password'}
                             placeholder="••••••••"
                             value={loginPassword}
                             onChange={(e) => setLoginPassword(e.target.value)}
                           />
                           <button
                             type="button"
                             onClick={() => setShowPassword(!showPassword)}
                             className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                           >
                             {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                           </button>
                         </div>
                         {errors.password && (
                           <p className="text-sm text-destructive">{errors.password}</p>
                         )}
                       </div>
                       <div className="flex justify-end">
                         <button
                           type="button"
                           onClick={() => setShowForgotPassword(true)}
                           className="text-sm text-primary hover:underline"
                         >
                           Forgot password?
                         </button>
                       </div>
                       <Button type="submit" className="w-full" disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                         Sign In
                       </Button>
                     </form>
                   </CardContent>
                 </Card>
               </TabsContent>
 
               <TabsContent value="register">
                 <Card>
                   <CardHeader>
                     <CardTitle>Create Account</CardTitle>
                     <CardDescription>
                       Register to access Agatsa SDK and developer tools
                     </CardDescription>
                   </CardHeader>
                   <CardContent>
                     <form onSubmit={handleRegister} className="space-y-4">
                       <div className="space-y-2">
                         <Label htmlFor="full-name">Full Name *</Label>
                         <Input
                           id="full-name"
                           type="text"
                           placeholder="John Doe"
                           value={fullName}
                           onChange={(e) => setFullName(e.target.value)}
                         />
                         {errors.fullName && (
                           <p className="text-sm text-destructive">{errors.fullName}</p>
                         )}
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="company-name">Company Name</Label>
                         <Input
                           id="company-name"
                           type="text"
                           placeholder="Acme Healthcare"
                           value={companyName}
                           onChange={(e) => setCompanyName(e.target.value)}
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="register-email">Email *</Label>
                         <Input
                           id="register-email"
                           type="email"
                           placeholder="you@company.com"
                           value={registerEmail}
                           onChange={(e) => setRegisterEmail(e.target.value)}
                         />
                         {errors.email && (
                           <p className="text-sm text-destructive">{errors.email}</p>
                         )}
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="phone">Phone</Label>
                         <Input
                           id="phone"
                           type="tel"
                           placeholder="+91 98765 43210"
                           value={phone}
                           onChange={(e) => setPhone(e.target.value)}
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="register-password">Password *</Label>
                         <div className="relative">
                           <Input
                             id="register-password"
                             type={showPassword ? 'text' : 'password'}
                             placeholder="••••••••"
                             value={registerPassword}
                             onChange={(e) => setRegisterPassword(e.target.value)}
                           />
                           <button
                             type="button"
                             onClick={() => setShowPassword(!showPassword)}
                             className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                           >
                             {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                           </button>
                         </div>
                         {errors.password && (
                           <p className="text-sm text-destructive">{errors.password}</p>
                         )}
                         <p className="text-xs text-muted-foreground">
                           Must be at least 8 characters
                         </p>
                       </div>
                       <Button type="submit" className="w-full" disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                         Create Account
                       </Button>
                     </form>
                   </CardContent>
                 </Card>
               </TabsContent>
             </Tabs>
           )}
 
           {/* Footer */}
           <p className="text-center text-sm text-muted-foreground mt-6">
             By continuing, you agree to our{' '}
             <Link to="/terms-of-service" className="text-primary hover:underline">
               Terms of Service
             </Link>{' '}
             and{' '}
             <Link to="/privacy-policy" className="text-primary hover:underline">
               Privacy Policy
             </Link>
           </p>
         </div>
       </div>
     </div>
   );
 }