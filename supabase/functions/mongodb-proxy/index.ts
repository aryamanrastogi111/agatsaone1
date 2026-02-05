 import { MongoClient } from "mongodb";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
 };
 
// Helper to check if user is admin
async function isAdmin(supabase: any, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();
  return !!data;
}

 Deno.serve(async (req) => {
   // Handle CORS preflight
   if (req.method === 'OPTIONS') {
     return new Response('ok', { headers: corsHeaders });
   }
 
   let client: MongoClient | null = null;
 
   try {
     // Authenticate user
     const authHeader = req.headers.get('Authorization');
     if (!authHeader?.startsWith('Bearer ')) {
       return new Response(
         JSON.stringify({ error: 'Unauthorized' }),
         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const supabase = createClient(
       Deno.env.get('SUPABASE_URL')!,
       Deno.env.get('SUPABASE_ANON_KEY')!,
       { global: { headers: { Authorization: authHeader } } }
     );
 
     const token = authHeader.replace('Bearer ', '');
     const { data: { user }, error: userError } = await supabase.auth.getUser(token);
 
     if (userError || !user) {
       return new Response(
         JSON.stringify({ error: 'Unauthorized' }),
         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     const userId = user.id;
     console.log(`Authenticated user: ${userId}`);
 
     // Get user profile to find their client_id mapping
     const { data: profile } = await supabase
       .from('profiles')
       .select('email, company_name')
       .eq('id', userId)
       .maybeSingle();
 
     if (!profile) {
       return new Response(
         JSON.stringify({ error: 'Profile not found' }),
         { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
     }
 
     // Parse request body
     const { action, filters } = await req.json();
     console.log(`Action: ${action}, Filters:`, filters);
 
     // Connect to MongoDB
     const mongoUri = Deno.env.get('MONGODB_URI');
     if (!mongoUri) {
       throw new Error('MONGODB_URI not configured');
     }
 
     client = new MongoClient(mongoUri);
     await client.connect();
     console.log('Connected to MongoDB');
 
      // Database names for different data
      const sanketDb = client.db('Sanket');
      const sdkUserKeysDb = client.db('sdkUserKeys');
 
     let result: any = {};
 
     switch (action) {
       case 'get_devices': {
         // First, find the client info from sdkUserKeys using company name or email
          // sdkUserKeys is a DATABASE, list its collections to find client data
          const sdkCollections = await sdkUserKeysDb.listCollections().toArray();
          console.log('Collections in sdkUserKeys DB:', sdkCollections.map(c => c.name));
         
          // Try common collection names for client data
          let clientInfo = null;
          const possibleCollections = ['users', 'clients', 'keys', 'sdk_users', 'user_keys'];
          
          for (const collName of possibleCollections) {
            const coll = sdkUserKeysDb.collection(collName);
            clientInfo = await coll.findOne({
              $or: [
                { client_name: { $regex: profile.company_name || '', $options: 'i' } },
                { email: profile.email },
                { name: { $regex: profile.company_name || '', $options: 'i' } }
              ]
            });
            if (clientInfo) {
              console.log(`Found client in collection: ${collName}`);
              break;
            }
          }
          
          // Fallback: try the first collection if none of the common names work
          if (!clientInfo && sdkCollections.length > 0) {
            const firstColl = sdkUserKeysDb.collection(sdkCollections[0].name);
            clientInfo = await firstColl.findOne({
           $or: [
             { client_name: { $regex: profile.company_name || '', $options: 'i' } },
                { email: profile.email },
                { name: { $regex: profile.company_name || '', $options: 'i' } }
           ]
         });
          }
 
         console.log('Client info found:', clientInfo);
 
         if (!clientInfo) {
           result = { devices: [], message: 'No SDK client found for this account' };
           break;
         }
 
         // Now fetch ECGs for this client from ecgs collection
          const ecgsCollection = sanketDb.collection('ecgs');
         
         // SDK users have usernames containing "sdk" and their client_id
         const clientId = clientInfo.client_id || clientInfo.clientId;
         const query: any = {
           username: { $regex: `sdk.*${clientId}`, $options: 'i' }
         };
 
         // Apply additional filters
         if (filters?.productType && filters.productType !== 'all') {
           query.device_type = filters.productType;
         }
 
         const devices = await ecgsCollection
           .find(query)
           .sort({ created_at: -1 })
           .limit(100)
           .toArray();
 
         // Transform to expected format
         const transformedDevices = devices.map((doc: any) => ({
           id: doc._id.toString(),
           serial: doc.device_id || doc.serial || `SDK-${doc._id.toString().slice(-8)}`,
           productType: doc.device_type || 'sanketlife',
           activatedAt: doc.created_at || doc.timestamp,
           ecgCount: 1, // Each document is one ECG
           lastSync: doc.timestamp || doc.created_at,
           status: 'active',
           username: doc.username,
         }));
 
         // Group by device serial to get ECG counts
         const deviceMap = new Map();
         for (const device of transformedDevices) {
           const key = device.serial;
           if (deviceMap.has(key)) {
             const existing = deviceMap.get(key);
             existing.ecgCount += 1;
             if (new Date(device.lastSync) > new Date(existing.lastSync)) {
               existing.lastSync = device.lastSync;
             }
           } else {
             deviceMap.set(key, device);
           }
         }
 
         result = {
           devices: Array.from(deviceMap.values()),
           clientInfo: {
             name: clientInfo.client_name,
             clientId: clientId,
           }
         };
         break;
       }
 
       case 'get_recharge_history': {
         // Fetch from sdk_device_plans collection
          const plansCollection = sanketDb.collection('sdk_device_plans');
         
          // Find client in sdkUserKeys database
          const sdkCollections = await sdkUserKeysDb.listCollections().toArray();
          let clientInfo = null;
          
          for (const coll of sdkCollections) {
            const collection = sdkUserKeysDb.collection(coll.name);
            clientInfo = await collection.findOne({
           $or: [
             { client_name: { $regex: profile.company_name || '', $options: 'i' } },
             { email: profile.email }
           ]
         });
            if (clientInfo) break;
          }
 
         if (!clientInfo) {
           result = { plans: [] };
           break;
         }
 
         const clientId = clientInfo.client_id || clientInfo.clientId;
         const plans = await plansCollection
           .find({ client_id: clientId })
           .sort({ created_at: -1 })
           .toArray();
 
         result = {
           plans: plans.map((plan: any) => ({
             id: plan._id.toString(),
             planName: plan.plan_name,
             credits: plan.credits,
             amount: plan.amount,
             status: plan.status,
             createdAt: plan.created_at,
           }))
         };
         break;
       }
 
       case 'get_ecg_stats': {
         // Get ECG statistics for the client
          const ecgsCollection = sanketDb.collection('ecgs');
         
          // Find client in sdkUserKeys database
          const sdkCollections = await sdkUserKeysDb.listCollections().toArray();
          let clientInfo = null;
          
          for (const coll of sdkCollections) {
            const collection = sdkUserKeysDb.collection(coll.name);
            clientInfo = await collection.findOne({
           $or: [
             { client_name: { $regex: profile.company_name || '', $options: 'i' } },
             { email: profile.email }
           ]
         });
            if (clientInfo) break;
          }
 
         if (!clientInfo) {
           result = { totalEcgs: 0, thisMonth: 0, thisWeek: 0 };
           break;
         }
 
         const clientId = clientInfo.client_id || clientInfo.clientId;
         
         const totalEcgs = await ecgsCollection.countDocuments({
           username: { $regex: `sdk.*${clientId}`, $options: 'i' }
         });
 
         const now = new Date();
         const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
         const startOfWeek = new Date(now);
         startOfWeek.setDate(now.getDate() - now.getDay());
 
         const thisMonth = await ecgsCollection.countDocuments({
           username: { $regex: `sdk.*${clientId}`, $options: 'i' },
           timestamp: { $gte: startOfMonth }
         });
 
         const thisWeek = await ecgsCollection.countDocuments({
           username: { $regex: `sdk.*${clientId}`, $options: 'i' },
           timestamp: { $gte: startOfWeek }
         });
 
         result = { totalEcgs, thisMonth, thisWeek };
         break;
       }
 
      // ===== ADMIN-ONLY ACTIONS =====
      case 'admin_get_all_clients': {
        // Check if user is admin
        const userIsAdmin = await isAdmin(supabase, userId);
        if (!userIsAdmin) {
          return new Response(
            JSON.stringify({ error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Debug: List all collections in the database
        const sdkCollections = await sdkUserKeysDb.listCollections().toArray();
        console.log('Available collections in sdkUserKeys DB:', sdkCollections.map(c => c.name));

        const ecgsCollection = sanketDb.collection('ecgs');
        
        // Get all SDK clients from all collections in sdkUserKeys database
        let allClients: any[] = [];
        
        for (const collInfo of sdkCollections) {
          const coll = sdkUserKeysDb.collection(collInfo.name);
          const docs = await coll.find({}).toArray();
          console.log(`Found ${docs.length} documents in collection: ${collInfo.name}`);
          if (docs.length > 0) {
            console.log('Sample document structure:', JSON.stringify(docs[0], null, 2));
            allClients = [...allClients, ...docs];
          }
        }
        
        console.log(`Total SDK clients found: ${allClients.length}`);

        // Get usage stats for each client
        const clientsWithStats = await Promise.all(
          allClients.map(async (client: any) => {
            // Try multiple possible field names for client ID
            const clientId = client.client_id || client.clientId || client.ClientId || client.id;
            const clientName = client.client_name || client.clientName || client.ClientName || client.name || client.Name || 'Unknown';
            const clientEmail = client.email || client.Email || client.mail || '';
            const clientPhone = client.phone || client.Phone || client.mobile || client.Mobile || '';
            const clientApiKey = client.api_key || client.apiKey || client.ApiKey || client.key || '';
            
            // Count ECGs for this client
            const totalEcgs = clientId ? await ecgsCollection.countDocuments({
              username: { $regex: `sdk.*${clientId}`, $options: 'i' }
            }) : 0;

            // Get last ECG date
            const lastEcg = clientId ? await ecgsCollection.findOne(
              { username: { $regex: `sdk.*${clientId}`, $options: 'i' } },
              { sort: { timestamp: -1 } }
            ) : null;

            return {
              id: client._id.toString(),
              clientId: clientId || 'N/A',
              clientName: clientName,
              email: clientEmail,
              phone: clientPhone,
              apiKey: clientApiKey ? `${String(clientApiKey).slice(0, 8)}...` : 'N/A',
              totalEcgs,
              lastActivity: lastEcg?.timestamp || null,
              createdAt: client.created_at || client.createdAt || null,
              status: client.status || 'active',
            };
          })
        );

        result = { clients: clientsWithStats };
        break;
      }

      case 'admin_get_client_details': {
        // Check if user is admin
        const userIsAdmin = await isAdmin(supabase, userId);
        if (!userIsAdmin) {
          return new Response(
            JSON.stringify({ error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { clientId } = filters || {};
        if (!clientId) {
          return new Response(
            JSON.stringify({ error: 'clientId required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const ecgsCollection = sanketDb.collection('ecgs');
        
        // Get client info
        let clientInfo = null;
        const sdkCollections = await sdkUserKeysDb.listCollections().toArray();
        
        for (const collInfo of sdkCollections) {
          const coll = sdkUserKeysDb.collection(collInfo.name);
          clientInfo = await coll.findOne({
          $or: [
            { client_id: clientId },
            { clientId: clientId }
          ]
        });
          if (clientInfo) break;
        }

        if (!clientInfo) {
          return new Response(
            JSON.stringify({ error: 'Client not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get ECG stats
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const totalEcgs = await ecgsCollection.countDocuments({
          username: { $regex: `sdk.*${clientId}`, $options: 'i' }
        });

        const thisMonth = await ecgsCollection.countDocuments({
          username: { $regex: `sdk.*${clientId}`, $options: 'i' },
          timestamp: { $gte: startOfMonth }
        });

        const thisWeek = await ecgsCollection.countDocuments({
          username: { $regex: `sdk.*${clientId}`, $options: 'i' },
          timestamp: { $gte: startOfWeek }
        });

        // Get recent ECGs
        const recentEcgs = await ecgsCollection
          .find({ username: { $regex: `sdk.*${clientId}`, $options: 'i' } })
          .sort({ timestamp: -1 })
          .limit(10)
          .toArray();

        result = {
          client: {
            id: clientInfo._id.toString(),
            clientId: clientInfo.client_id || clientInfo.clientId,
            clientName: clientInfo.client_name || clientInfo.name,
            email: clientInfo.email,
            phone: clientInfo.phone || clientInfo.mobile,
            apiKey: clientInfo.api_key,
            createdAt: clientInfo.created_at || clientInfo.createdAt,
            status: clientInfo.status || 'active',
          },
          stats: { totalEcgs, thisMonth, thisWeek },
          recentEcgs: recentEcgs.map((ecg: any) => ({
            id: ecg._id.toString(),
            deviceId: ecg.device_id,
            timestamp: ecg.timestamp,
            deviceType: ecg.device_type,
          }))
        };
        break;
      }

      case 'admin_get_usage_summary': {
        // Check if user is admin
        const userIsAdmin = await isAdmin(supabase, userId);
        if (!userIsAdmin) {
          return new Response(
            JSON.stringify({ error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const ecgsCollection = sanketDb.collection('ecgs');
        
        // Count clients across all collections in sdkUserKeys database
        let totalClients = 0;
        const sdkCollections = await sdkUserKeysDb.listCollections().toArray();
        for (const collInfo of sdkCollections) {
          const coll = sdkUserKeysDb.collection(collInfo.name);
          totalClients += await coll.countDocuments({});
        }
        
        const totalEcgs = await ecgsCollection.countDocuments({
          username: { $regex: 'sdk', $options: 'i' }
        });

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthEcgs = await ecgsCollection.countDocuments({
          username: { $regex: 'sdk', $options: 'i' },
          timestamp: { $gte: startOfMonth }
        });

        result = {
          totalClients,
          totalEcgs,
          thisMonthEcgs,
        };
        break;
      }

       default:
         return new Response(
           JSON.stringify({ error: 'Invalid action' }),
           { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
     }
 
     return new Response(
       JSON.stringify(result),
       { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
 
   } catch (error: any) {
     console.error('MongoDB proxy error:', error);
     return new Response(
       JSON.stringify({ error: error.message }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     );
   } finally {
     if (client) {
       await client.close();
       console.log('MongoDB connection closed');
     }
   }
 });