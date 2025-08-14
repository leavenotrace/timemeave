-- TimeWeave Database Schema
-- Three core tables: Graph, Actions, Modules

-- Graph table: For managing structured materials (past can be rewritten)
CREATE TABLE IF NOT EXISTS graph (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  type VARCHAR(50) NOT NULL, -- 'note', 'document', 'reference', etc.
  tags TEXT[], -- Array of tags for categorization
  metadata JSONB DEFAULT '{}', -- Flexible metadata storage
  connections UUID[], -- Array of connected graph node IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Actions table: For implementing "folding" concept (present can be folded)
CREATE TABLE IF NOT EXISTS actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'active', 'folded', 'completed'
  priority INTEGER DEFAULT 3, -- 1-5 priority scale
  context JSONB DEFAULT '{}', -- Context for multi-use folding
  folded_actions UUID[], -- Array of folded action IDs
  parent_action_id UUID REFERENCES actions(id) ON DELETE SET NULL,
  graph_connections UUID[], -- Connected graph nodes
  estimated_time INTEGER, -- Estimated time in minutes
  actual_time INTEGER, -- Actual time spent
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Modules table: For automation and templates (future can be pre-compiled)
CREATE TABLE IF NOT EXISTS modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- 'template', 'automation', 'trigger', 'workflow'
  config JSONB DEFAULT '{}', -- Module configuration
  triggers JSONB DEFAULT '[]', -- Trigger conditions
  actions JSONB DEFAULT '[]', -- Actions to execute
  is_active BOOLEAN DEFAULT true,
  execution_count INTEGER DEFAULT 0,
  last_executed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_graph_user_id ON graph(user_id);
CREATE INDEX IF NOT EXISTS idx_graph_type ON graph(type);
CREATE INDEX IF NOT EXISTS idx_graph_tags ON graph USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_graph_created_at ON graph(created_at);

CREATE INDEX IF NOT EXISTS idx_actions_user_id ON actions(user_id);
CREATE INDEX IF NOT EXISTS idx_actions_status ON actions(status);
CREATE INDEX IF NOT EXISTS idx_actions_priority ON actions(priority);
CREATE INDEX IF NOT EXISTS idx_actions_due_date ON actions(due_date);
CREATE INDEX IF NOT EXISTS idx_actions_parent ON actions(parent_action_id);

CREATE INDEX IF NOT EXISTS idx_modules_user_id ON modules(user_id);
CREATE INDEX IF NOT EXISTS idx_modules_type ON modules(type);
CREATE INDEX IF NOT EXISTS idx_modules_active ON modules(is_active);

-- Enable Row Level Security
ALTER TABLE graph ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access their own graph nodes" ON graph
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own actions" ON actions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own modules" ON modules
  FOR ALL USING (auth.uid() = user_id);
