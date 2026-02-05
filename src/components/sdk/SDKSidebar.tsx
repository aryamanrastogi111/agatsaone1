 import { Link, useLocation } from 'react-router-dom';
 import { cn } from '@/lib/utils';
 import {
   LayoutDashboard,
   Smartphone,
   Download,
   FileText,
   CreditCard,
   HelpCircle,
   Settings,
   Shield,
   LogOut,
   Menu,
   X,
 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { useState } from 'react';
 import { useAuth } from '@/hooks/useAuth';
 import agatsaLogo from '@/assets/agatsa-logo.png';
 
 const navItems = [
   { href: '/sdk/dashboard', label: 'Overview', icon: LayoutDashboard },
   { href: '/sdk/devices', label: 'My Devices', icon: Smartphone },
   { href: '/sdk/downloads', label: 'Downloads', icon: Download },
   { href: '/sdk/docs', label: 'Documentation', icon: FileText },
   { href: '/sdk/credits', label: 'Credits & Recharge', icon: CreditCard },
   { href: '/sdk/support', label: 'Support', icon: HelpCircle },
 ];
 
 const adminItems = [
   { href: '/sdk/admin', label: 'Admin Panel', icon: Shield },
 ];
 
 export function SDKSidebar() {
   const location = useLocation();
   const { isAdmin, signOut, user } = useAuth();
   const [mobileOpen, setMobileOpen] = useState(false);
 
   const isActive = (href: string) => location.pathname === href;
 
   const NavContent = () => (
     <>
       {/* Logo */}
       <div className="p-4 border-b">
         <Link to="/sdk" className="flex items-center gap-2">
           <img src={agatsaLogo} alt="Agatsa" className="h-8" />
           <span className="font-semibold text-sm">SDK Portal</span>
         </Link>
       </div>
 
       {/* Navigation */}
       <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
         {navItems.map((item) => (
           <Link
             key={item.href}
             to={item.href}
             onClick={() => setMobileOpen(false)}
             className={cn(
               'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
               isActive(item.href)
                 ? 'bg-primary text-primary-foreground'
                 : 'text-muted-foreground hover:bg-muted hover:text-foreground'
             )}
           >
             <item.icon className="h-4 w-4" />
             {item.label}
           </Link>
         ))}
 
         {/* Admin Section */}
         {isAdmin && (
           <>
             <div className="pt-4 pb-2">
               <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                 Admin
               </span>
             </div>
             {adminItems.map((item) => (
               <Link
                 key={item.href}
                 to={item.href}
                 onClick={() => setMobileOpen(false)}
                 className={cn(
                   'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                   isActive(item.href)
                     ? 'bg-primary text-primary-foreground'
                     : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                 )}
               >
                 <item.icon className="h-4 w-4" />
                 {item.label}
               </Link>
             ))}
           </>
         )}
       </nav>
 
       {/* User Section */}
       <div className="p-4 border-t">
         <div className="flex items-center gap-3 mb-3">
           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
             <span className="text-xs font-semibold text-primary">
               {user?.email?.charAt(0).toUpperCase()}
             </span>
           </div>
           <div className="flex-1 min-w-0">
             <p className="text-sm font-medium truncate">{user?.email}</p>
             <p className="text-xs text-muted-foreground">
               {isAdmin ? 'Administrator' : 'Developer'}
             </p>
           </div>
         </div>
         <Button
           variant="ghost"
           size="sm"
           className="w-full justify-start text-muted-foreground hover:text-foreground"
           onClick={() => signOut()}
         >
           <LogOut className="h-4 w-4 mr-2" />
           Sign Out
         </Button>
       </div>
     </>
   );
 
   return (
     <>
       {/* Mobile Toggle */}
       <Button
         variant="ghost"
         size="icon"
         className="fixed top-4 left-4 z-50 lg:hidden"
         onClick={() => setMobileOpen(!mobileOpen)}
       >
         {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
       </Button>
 
       {/* Mobile Overlay */}
       {mobileOpen && (
         <div
           className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
           onClick={() => setMobileOpen(false)}
         />
       )}
 
       {/* Sidebar */}
       <aside
         className={cn(
           'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r flex flex-col transition-transform duration-300',
           mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
         )}
       >
         <NavContent />
       </aside>
     </>
   );
 }