 import { useState, useEffect, useCallback } from 'react';
 import { User, Session } from '@supabase/supabase-js';
 import { supabase } from '@/integrations/supabase/client';
 import { useNavigate } from 'react-router-dom';
 import { toast } from 'sonner';
 
 export function useAuth() {
   const [user, setUser] = useState<User | null>(null);
   const [session, setSession] = useState<Session | null>(null);
   const [loading, setLoading] = useState(true);
   const [isAdmin, setIsAdmin] = useState(false);
   const navigate = useNavigate();
 
   useEffect(() => {
     // Set up auth state listener FIRST
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       (event, session) => {
         setSession(session);
         setUser(session?.user ?? null);
         setLoading(false);
         
         // Check admin role after auth state change
         if (session?.user) {
           setTimeout(() => {
             checkAdminRole(session.user.id);
           }, 0);
         } else {
           setIsAdmin(false);
         }
       }
     );
 
     // THEN check for existing session
     supabase.auth.getSession().then(({ data: { session } }) => {
       setSession(session);
       setUser(session?.user ?? null);
       setLoading(false);
       
       if (session?.user) {
         checkAdminRole(session.user.id);
       }
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   const checkAdminRole = async (userId: string) => {
     try {
       const { data, error } = await supabase
         .from('user_roles')
         .select('role')
         .eq('user_id', userId)
         .eq('role', 'admin')
         .maybeSingle();
       
       setIsAdmin(!!data);
     } catch (error) {
       console.error('Error checking admin role:', error);
       setIsAdmin(false);
     }
   };
 
   const signUp = async (
     email: string,
     password: string,
     fullName: string,
     companyName?: string,
     phone?: string
   ) => {
     try {
       const redirectUrl = `${window.location.origin}/sdk/dashboard`;
       
       const { data, error } = await supabase.auth.signUp({
         email,
         password,
         options: {
           emailRedirectTo: redirectUrl,
           data: {
             full_name: fullName,
             company_name: companyName,
             phone: phone,
           },
         },
       });
 
       if (error) throw error;
 
       if (data.user && !data.session) {
         toast.success('Registration successful! Please check your email to verify your account.');
       } else if (data.session) {
         toast.success('Registration successful!');
         navigate('/sdk/dashboard');
       }
 
       return { data, error: null };
     } catch (error: any) {
       const message = error.message || 'An error occurred during sign up';
       toast.error(message);
       return { data: null, error };
     }
   };
 
   const signIn = async (email: string, password: string) => {
     try {
       const { data, error } = await supabase.auth.signInWithPassword({
         email,
         password,
       });
 
       if (error) throw error;
 
       toast.success('Welcome back!');
       navigate('/sdk/dashboard');
 
       return { data, error: null };
     } catch (error: any) {
       const message = error.message || 'Invalid email or password';
       toast.error(message);
       return { data: null, error };
     }
   };
 
   const signOut = async () => {
     try {
       const { error } = await supabase.auth.signOut();
       if (error) throw error;
       
       toast.success('Signed out successfully');
       navigate('/sdk');
     } catch (error: any) {
       toast.error(error.message || 'Error signing out');
     }
   };
 
   const resetPassword = async (email: string) => {
     try {
       const { error } = await supabase.auth.resetPasswordForEmail(email, {
         redirectTo: `${window.location.origin}/sdk/auth?mode=reset`,
       });
 
       if (error) throw error;
 
       toast.success('Password reset email sent! Check your inbox.');
       return { error: null };
     } catch (error: any) {
       toast.error(error.message || 'Error sending reset email');
       return { error };
     }
   };
 
   return {
     user,
     session,
     loading,
     isAdmin,
     signUp,
     signIn,
     signOut,
     resetPassword,
   };
 }