import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  try {
    // GET /api/points - Returns all 50 strategic points
    if (path === 'points' && req.method === 'GET') {
      const { data, error } = await supabaseClient
        .from('nasa_strategic_points')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /api/point/:id - Returns detailed information for a specific point
    if (path?.startsWith('point-') && req.method === 'GET') {
      const id = path.replace('point-', '');
      
      const { data, error } = await supabaseClient
        .from('nasa_strategic_points')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /api/sources - Lists metadata and status of NASA sources
    if (path === 'sources' && req.method === 'GET') {
      const { data, error } = await supabaseClient
        .from('nasa_api_metadata')
        .select('*')
        .order('source_name');

      if (error) throw error;

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /api/statistics - Returns averages and trends by ocean
    if (path === 'statistics' && req.method === 'GET') {
      const { data, error } = await supabaseClient
        .from('nasa_strategic_points')
        .select('region, chlorophyll, phytoplankton_index, eddy_activity, sea_surface_height');

      if (error) throw error;

      // Calculate statistics by region
      const regionStats: Record<string, any> = {};
      
      data.forEach((point: any) => {
        if (!regionStats[point.region]) {
          regionStats[point.region] = {
            count: 0,
            chlorophyll_sum: 0,
            phytoplankton_sum: 0,
            eddy_sum: 0,
            ssh_sum: 0
          };
        }
        
        regionStats[point.region].count++;
        regionStats[point.region].chlorophyll_sum += point.chlorophyll || 0;
        regionStats[point.region].phytoplankton_sum += point.phytoplankton_index || 0;
        regionStats[point.region].eddy_sum += point.eddy_activity || 0;
        regionStats[point.region].ssh_sum += point.sea_surface_height || 0;
      });

      const statistics = Object.entries(regionStats).map(([region, stats]: [string, any]) => ({
        region,
        point_count: stats.count,
        avg_chlorophyll: (stats.chlorophyll_sum / stats.count).toFixed(4),
        avg_phytoplankton_index: (stats.phytoplankton_sum / stats.count).toFixed(4),
        avg_eddy_activity: (stats.eddy_sum / stats.count).toFixed(4),
        avg_sea_surface_height: (stats.ssh_sum / stats.count).toFixed(4)
      }));

      return new Response(
        JSON.stringify(statistics),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in nasa-api function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
