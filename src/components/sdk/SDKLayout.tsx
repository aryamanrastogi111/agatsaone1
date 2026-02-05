 import { useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { useAuth } from '@/hooks/useAuth';
 import { SDKSidebar } from './SDKSidebar';
 import { Loader2 } from 'lucide-react';
 
 interface SDKLayoutProps {
   children: React.ReactNode;
   requireAdmin?: boolean;
 }
 
 export function SDKLayout({ children, requireAdmin = false }: SDKLayoutProps) {
   const { user, loading, isAdmin } = useAuth();
   const navigate = useNavigate();
 
   useEffect(() => {
     if (!loading) {
       if (!user) {
         navigate('/sdk/auth');
       } else if (requireAdmin && !isAdmin) {
         navigate('/sdk/dashboard');
       }
     }
   }, [user, loading, isAdmin, requireAdmin, navigate]);
 
   if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
     );
   }
 
   if (!user) {
     return null;
   }
 
   if (requireAdmin && !isAdmin) {
     return null;
   }
 
   return (
     <div className="flex min-h-screen w-full bg-background">
       <SDKSidebar />
       <main className="flex-1 overflow-auto">
         <div className="p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
           {children}
         </div>
       </main>
     </div>
   );
 }