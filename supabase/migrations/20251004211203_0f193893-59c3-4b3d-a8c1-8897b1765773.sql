-- Create table for NASA strategic points
CREATE TABLE public.nasa_strategic_points (
  id BIGSERIAL PRIMARY KEY,
  latitude NUMERIC(9, 6) NOT NULL,
  longitude NUMERIC(9, 6) NOT NULL,
  region TEXT NOT NULL,
  chlorophyll NUMERIC(10, 4),
  phytoplankton_index NUMERIC(5, 4),
  eddy_activity NUMERIC(5, 4),
  sea_surface_height NUMERIC(10, 4),
  sources TEXT[] NOT NULL,
  summary TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.nasa_strategic_points ENABLE ROW LEVEL SECURITY;

-- Public read access (no authentication needed)
CREATE POLICY "Public read access to NASA points"
ON public.nasa_strategic_points
FOR SELECT
USING (true);

-- Create index for faster queries
CREATE INDEX idx_nasa_points_location ON public.nasa_strategic_points(latitude, longitude);
CREATE INDEX idx_nasa_points_updated ON public.nasa_strategic_points(last_updated DESC);

-- Create table for API metadata
CREATE TABLE public.nasa_api_metadata (
  id BIGSERIAL PRIMARY KEY,
  source_name TEXT UNIQUE NOT NULL,
  last_fetch TIMESTAMP WITH TIME ZONE,
  status TEXT,
  records_count INTEGER DEFAULT 0,
  error_message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.nasa_api_metadata ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access to API metadata"
ON public.nasa_api_metadata
FOR SELECT
USING (true);

-- Insert initial metadata records
INSERT INTO public.nasa_api_metadata (source_name, status) VALUES
  ('PACE', 'pending'),
  ('MODIS', 'pending'),
  ('SWOT', 'pending');