import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

Deno.serve(async (req) => {
  try {
    // This is a test function - require admin authentication
    const { createClientFromRequest } = await import('npm:@base44/sdk@0.8.6');
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    console.log('🔍 Testing Supabase connection...');
    console.log('URL:', Deno.env.get('SUPABASE_URL'));
    console.log('Service role key exists:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
    console.log('Service role key starts with:', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.substring(0, 10));
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    );

    // Test 1: Simple select to verify connection
    console.log('Test 1: Checking table access...');
    const { data: selectData, error: selectError } = await supabase
      .from('listings')
      .select('*')
      .limit(1);

    if (selectError) {
      console.error('❌ Select failed:', selectError);
      return Response.json({ 
        test: 'select',
        error: selectError,
        errorString: String(selectError),
        errorMessage: selectError.message
      });
    }

    console.log('✅ Select succeeded, found records:', selectData?.length || 0);

    // Test 2: Try a minimal insert
    console.log('Test 2: Trying minimal insert...');
    const testRecord = {
      id: 'test-' + Date.now(),
      title: 'Test Sale',
      description: 'Test description',
      location_lat: 40.7128,
      location_lng: -74.0060,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 3600000).toISOString(),
      photos: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Inserting:', JSON.stringify(testRecord, null, 2));

    const { data: insertData, error: insertError } = await supabase
      .from('listings')
      .insert([testRecord])
      .select();

    if (insertError) {
      console.error('❌ Insert failed:', insertError);
      console.error('Error type:', typeof insertError);
      console.error('Error keys:', Object.keys(insertError));
      console.error('Error stringified:', JSON.stringify(insertError, null, 2));
      
      return Response.json({ 
        test: 'insert',
        error: insertError,
        errorString: String(insertError),
        errorMessage: insertError.message,
        errorCode: insertError.code,
        errorDetails: insertError.details,
        errorHint: insertError.hint,
        allErrorProps: Object.getOwnPropertyNames(insertError)
      });
    }

    console.log('✅ Insert succeeded!', insertData);

    // Clean up test record
    await supabase.from('listings').delete().eq('id', testRecord.id);

    return Response.json({ 
      success: true,
      message: 'All tests passed!',
      selectCount: selectData?.length || 0,
      insertedId: insertData?.[0]?.id
    });

  } catch (error) {
    console.error('❌ Exception:', error);
    return Response.json({ 
      exception: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});