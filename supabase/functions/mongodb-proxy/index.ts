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
 
      // Database names for different data - NOTE: MongoDB is case-sensitive
      const sanketDb = client.db('sanket');
      // sdkUsersKeys is a COLLECTION in the sanket database
      const sdkUsersKeysCollection = sanketDb.collection('sdkUsersKeys');
 
     let result: any = {};
 
     switch (action) {
        case 'admin_list_databases': {
          // Check if user is admin
          const userIsAdmin = await isAdmin(supabase, userId);
          if (!userIsAdmin) {
            return new Response(
              JSON.stringify({ error: 'Admin access required' }),
              { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // List all databases
          const adminDb = client.db('admin');
          const dbList = await adminDb.admin().listDatabases();
          console.log('Available databases:', dbList.databases.map((d: any) => d.name));
          
          // Skip system databases that cause authorization errors
          const skipDbs = ['admin', 'config', 'local'];
          
          const dbsWithCollections = await Promise.all(
            dbList.databases
              .filter((dbInfo: any) => !skipDbs.includes(dbInfo.name))
              .map(async (dbInfo: any) => {
              const db = client!.db(dbInfo.name);
              try {
                const collections = await db.listCollections().toArray();
              
              // Get sample document from first collection if any exist
              let sampleDoc = null;
              if (collections.length > 0) {
                const firstColl = db.collection(collections[0].name);
                sampleDoc = await firstColl.findOne({});
              }
              
              return {
                name: dbInfo.name,
                sizeOnDisk: dbInfo.sizeOnDisk,
                  collections: collections.map((c: any) => c.name),
                sampleDocFields: sampleDoc ? Object.keys(sampleDoc) : []
              };
              } catch (err) {
                console.log(`Error listing collections for ${dbInfo.name}:`, err);
                return {
                  name: dbInfo.name,
                  sizeOnDisk: dbInfo.sizeOnDisk,
                  collections: ['(access denied)'],
                  sampleDocFields: []
                };
              }
            })
          );
          
          result = { databases: dbsWithCollections };
          break;
        }

       case 'get_devices': {
         // Find client info from sdkUsersKeys collection
         const clientInfo = await sdkUsersKeysCollection.findOne({
           $or: [
             { name: { $regex: profile.company_name || '', $options: 'i' } },
             { email: profile.email },
             { username: { $regex: profile.company_name || '', $options: 'i' } }
           ]
         });
         console.log('Client info found:', clientInfo);
 
         if (!clientInfo) {
           result = { devices: [], message: 'No SDK client found for this account' };
           break;
         }
 
         // Now fetch ECGs for this client from ecgs collection
          const ecgsCollection = sanketDb.collection('ecgs');
         
         // Use username from sdkUsersKeys to find ECGs
         const clientUsername = clientInfo.username;
         const query: any = {
           username: clientUsername
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
             name: clientInfo.name,
             username: clientUsername,
           }
         };
         break;
       }
 
       case 'get_recharge_history': {
         // Fetch from sdk_device_plans collection
          const plansCollection = sanketDb.collection('sdk_device_plans');
         
          // Find client in sdkUsersKeys collection
          const clientInfo = await sdkUsersKeysCollection.findOne({
            $or: [
              { name: { $regex: profile.company_name || '', $options: 'i' } },
              { email: profile.email }
            ]
          });
 
         if (!clientInfo) {
           result = { plans: [] };
           break;
         }
 
         const clientUsername = clientInfo.username;
         const plans = await plansCollection
           .find({ username: clientUsername })
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
         
          // Find client in sdkUsersKeys collection
          const clientInfo = await sdkUsersKeysCollection.findOne({
            $or: [
              { name: { $regex: profile.company_name || '', $options: 'i' } },
              { email: profile.email }
            ]
          });
 
         if (!clientInfo) {
           result = { totalEcgs: 0, thisMonth: 0, thisWeek: 0, ecgLimit: 0 };
           break;
         }
 
         const clientUsername = clientInfo.username;
         
         const totalEcgs = await ecgsCollection.countDocuments({
           username: clientUsername
         });
 
         const now = new Date();
         const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
         const startOfWeek = new Date(now);
         startOfWeek.setDate(now.getDate() - now.getDay());
 
         const thisMonth = await ecgsCollection.countDocuments({
           username: clientUsername,
           timestamp: { $gte: startOfMonth }
         });
 
         const thisWeek = await ecgsCollection.countDocuments({
           username: clientUsername,
           timestamp: { $gte: startOfWeek }
         });
 
         result = { 
           totalEcgs: clientInfo.totalECGTaken || totalEcgs, 
           thisMonth, 
           thisWeek,
           ecgLimit: clientInfo.ECGLimit || 0
         };
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

        const ecgsCollection = sanketDb.collection('ecgs');
        
        // Get all SDK clients from sdkUsersKeys collection
        const allClients = await sdkUsersKeysCollection.find({}).toArray();
        console.log(`Total SDK clients found: ${allClients.length}`);

        // Get usage stats for each client
        const clientsWithStats = await Promise.all(
          allClients.map(async (client: any) => {
            // Use exact field names from sdkUsersKeys collection
            const clientUsername = client.username || '';
            const clientName = client.name || 'Unknown';
            const clientEmail = client.email || '';
            const clientPhone = client.clientPhone || '';
            const clientKey = client.client_key || '';
            
            // Get last ECG date from ecgs collection
            const lastEcg = clientUsername ? await ecgsCollection.findOne(
              { username: clientUsername },
              { sort: { timestamp: -1 } }
            ) : null;

            return {
              id: client._id.toString(),
              username: clientUsername,
              clientName: clientName,
              email: clientEmail,
              phone: clientPhone,
              clientKey: clientKey ? `${String(clientKey).slice(0, 12)}...` : 'N/A',
              totalEcgs: client.totalECGTaken || 0,
              ecgLimit: client.ECGLimit || 0,
              lastActivity: lastEcg?.timestamp || null,
              updatedAt: client.updated_at || null,
              agatsaMobileNo: client.agatsaMobileNo || '',
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

        const { username } = filters || {};
        if (!username) {
          return new Response(
           JSON.stringify({ error: 'username required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const ecgsCollection = sanketDb.collection('ecgs');
        
        // Get client info from sdkUsersKeys
        const clientInfo = await sdkUsersKeysCollection.findOne({ username });

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
          username: username
        });

        const thisMonth = await ecgsCollection.countDocuments({
          username: username,
          timestamp: { $gte: startOfMonth }
        });

        const thisWeek = await ecgsCollection.countDocuments({
          username: username,
          timestamp: { $gte: startOfWeek }
        });

        // Get recent ECGs
        const recentEcgs = await ecgsCollection
          .find({ username: username })
          .sort({ timestamp: -1 })
          .limit(10)
          .toArray();

        result = {
          client: {
            id: clientInfo._id.toString(),
            username: clientInfo.username,
            clientName: clientInfo.name,
            email: clientInfo.email,
            phone: clientInfo.clientPhone,
            clientKey: clientInfo.client_key,
            secretKey: clientInfo.secret_key,
            totalECGTaken: clientInfo.totalECGTaken,
            ecgLimit: clientInfo.ECGLimit,
            agatsaMobileNo: clientInfo.agatsaMobileNo,
            updatedAt: clientInfo.updated_at,
          },
          stats: { totalEcgs: clientInfo.totalECGTaken || totalEcgs, thisMonth, thisWeek, ecgLimit: clientInfo.ECGLimit },
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
        
        // Count clients in sdkUsersKeys collection
        const totalClients = await sdkUsersKeysCollection.countDocuments({});
        
        // Get all usernames from sdkUsersKeys
        const allClients = await sdkUsersKeysCollection.find({}, { projection: { username: 1, totalECGTaken: 1 } }).toArray();
        const usernames = allClients.map((c: any) => c.username).filter(Boolean);
        
        // Sum totalECGTaken from all clients
        const totalEcgs = allClients.reduce((sum: number, c: any) => sum + (c.totalECGTaken || 0), 0);

        // Count this month's ECGs
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthEcgs = await ecgsCollection.countDocuments({
          username: { $in: usernames },
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