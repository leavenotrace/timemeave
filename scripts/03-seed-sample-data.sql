-- Insert sample data for demonstration
INSERT INTO public.graph (title, content, type, tags) VALUES
('Welcome to TimeWeave', 'This is your first graph node. Use this system to manage your knowledge and ideas.', 'note', ARRAY['welcome', 'getting-started']),
('Project Planning Template', 'A template for planning new projects with key milestones and deliverables.', 'template', ARRAY['planning', 'template']),
('Meeting Notes Format', 'Standard format for taking meeting notes with action items and follow-ups.', 'document', ARRAY['meetings', 'format']);

INSERT INTO public.actions (title, description, priority, estimated_time, tags) VALUES
('Review TimeWeave Documentation', 'Go through the system documentation to understand all features', 2, 45, ARRAY['learning', 'documentation']),
('Set up first project', 'Create a new project using the planning template', 1, 60, ARRAY['setup', 'project']),
('Organize knowledge base', 'Review and categorize existing notes and documents', 3, 90, ARRAY['organization', 'cleanup']);

INSERT INTO public.modules (name, description, type, trigger_conditions, actions) VALUES
('Daily Review Reminder', 'Automatically remind to review daily progress', 'automation', 
 '{"type": "schedule", "time": "18:00", "frequency": "daily"}',
 '{"actions": [{"type": "notification", "message": "Time for daily review!"}]}'),
('Project Template Creator', 'Template for creating new project structures', 'template',
 '{"type": "manual"}',
 '{"actions": [{"type": "create_graph_node", "template": "project_structure"}]}');
