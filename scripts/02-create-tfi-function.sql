-- Create function to calculate TFI (Time-Folding Index)
CREATE OR REPLACE FUNCTION calculate_tfi()
RETURNS TABLE(
    total_score NUMERIC,
    graph_score NUMERIC,
    actions_score NUMERIC,
    modules_score NUMERIC,
    productivity_level TEXT
) AS $$
DECLARE
    graph_count INTEGER;
    actions_count INTEGER;
    modules_count INTEGER;
    folded_actions_count INTEGER;
    active_modules_count INTEGER;
    g_score NUMERIC;
    a_score NUMERIC;
    m_score NUMERIC;
    total NUMERIC;
    level TEXT;
BEGIN
    -- Count graph nodes
    SELECT COUNT(*) INTO graph_count FROM public.graph;
    
    -- Count actions and folded actions
    SELECT COUNT(*) INTO actions_count FROM public.actions;
    SELECT COUNT(*) INTO folded_actions_count FROM public.actions WHERE array_length(folded_actions, 1) > 0;
    
    -- Count modules and active modules
    SELECT COUNT(*) INTO modules_count FROM public.modules;
    SELECT COUNT(*) INTO active_modules_count FROM public.modules WHERE is_active = true;
    
    -- Calculate scores (0-100 scale)
    g_score := LEAST(100, graph_count * 5);
    a_score := CASE 
        WHEN actions_count = 0 THEN 0
        ELSE LEAST(100, (folded_actions_count::NUMERIC / actions_count * 100) + (actions_count * 2))
    END;
    m_score := CASE 
        WHEN modules_count = 0 THEN 0
        ELSE LEAST(100, (active_modules_count::NUMERIC / modules_count * 100) + (modules_count * 3))
    END;
    
    -- Calculate total TFI
    total := (g_score + a_score + m_score) / 3;
    
    -- Determine productivity level
    IF total >= 80 THEN
        level := 'Master';
    ELSIF total >= 60 THEN
        level := 'Advanced';
    ELSIF total >= 40 THEN
        level := 'Intermediate';
    ELSIF total >= 20 THEN
        level := 'Beginner';
    ELSE
        level := 'Getting Started';
    END IF;
    
    RETURN QUERY SELECT total, g_score, a_score, m_score, level;
END;
$$ LANGUAGE plpgsql;
