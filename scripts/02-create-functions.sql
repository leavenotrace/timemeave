-- Utility functions for TimeWeave

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_graph_updated_at BEFORE UPDATE ON graph
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actions_updated_at BEFORE UPDATE ON actions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate TFI (Time-Folding Index)
CREATE OR REPLACE FUNCTION calculate_tfi(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    graph_count INTEGER;
    active_actions INTEGER;
    folded_actions INTEGER;
    active_modules INTEGER;
    tfi_score NUMERIC;
    result JSONB;
BEGIN
    -- Count graph nodes
    SELECT COUNT(*) INTO graph_count FROM graph WHERE user_id = user_uuid;
    
    -- Count active and folded actions
    SELECT COUNT(*) INTO active_actions FROM actions 
    WHERE user_id = user_uuid AND status IN ('pending', 'active');
    
    SELECT COUNT(*) INTO folded_actions FROM actions 
    WHERE user_id = user_uuid AND status = 'folded';
    
    -- Count active modules
    SELECT COUNT(*) INTO active_modules FROM modules 
    WHERE user_id = user_uuid AND is_active = true;
    
    -- Calculate TFI score (simplified formula)
    tfi_score := (graph_count * 0.3) + (folded_actions * 0.4) + (active_modules * 0.3);
    
    result := jsonb_build_object(
        'tfi_score', tfi_score,
        'graph_nodes', graph_count,
        'active_actions', active_actions,
        'folded_actions', folded_actions,
        'active_modules', active_modules,
        'calculated_at', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
