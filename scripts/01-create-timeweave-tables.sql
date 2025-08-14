-- Create the three core tables for TimeWeave system
-- Graph: for managing structured materials (past can be rewritten)
CREATE TABLE IF NOT EXISTS public.graph (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT NOT NULL DEFAULT 'note',
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    connections UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Actions: for implementing folding concept (present can be folded)
CREATE TABLE IF NOT EXISTS public.actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    priority INTEGER DEFAULT 3,
    estimated_time INTEGER DEFAULT 30,
    actual_time INTEGER,
    tags TEXT[] DEFAULT '{}',
    folded_actions UUID[] DEFAULT '{}',
    connected_nodes UUID[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Modules: for automation and templates (future can be pre-compiled)
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'template',
    trigger_conditions JSONB DEFAULT '{}',
    actions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    execution_count INTEGER DEFAULT 0,
    last_executed TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_graph_type ON public.graph(type);
CREATE INDEX IF NOT EXISTS idx_graph_tags ON public.graph USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_graph_created_at ON public.graph(created_at);

CREATE INDEX IF NOT EXISTS idx_actions_status ON public.actions(status);
CREATE INDEX IF NOT EXISTS idx_actions_priority ON public.actions(priority);
CREATE INDEX IF NOT EXISTS idx_actions_tags ON public.actions USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_actions_created_at ON public.actions(created_at);

CREATE INDEX IF NOT EXISTS idx_modules_type ON public.modules(type);
CREATE INDEX IF NOT EXISTS idx_modules_is_active ON public.modules(is_active);
CREATE INDEX IF NOT EXISTS idx_modules_created_at ON public.modules(created_at);

-- Enable Row Level Security
ALTER TABLE public.graph ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now, can be restricted later)
CREATE POLICY "Allow all operations on graph" ON public.graph FOR ALL USING (true);
CREATE POLICY "Allow all operations on actions" ON public.actions FOR ALL USING (true);
CREATE POLICY "Allow all operations on modules" ON public.modules FOR ALL USING (true);
