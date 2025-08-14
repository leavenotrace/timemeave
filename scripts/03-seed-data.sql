-- Sample data for TimeWeave (optional)

-- Insert sample graph nodes
INSERT INTO graph (title, content, type, tags, user_id) VALUES
('Project Planning Template', 'A comprehensive template for project planning with milestones and deliverables.', 'template', ARRAY['planning', 'project', 'template'], auth.uid()),
('Meeting Notes Format', 'Standard format for capturing meeting notes with action items.', 'note', ARRAY['meetings', 'notes', 'format'], auth.uid()),
('Research Methodology', 'Framework for conducting thorough research on any topic.', 'reference', ARRAY['research', 'methodology', 'framework'], auth.uid());

-- Insert sample actions
INSERT INTO actions (title, description, status, priority, estimated_time, user_id) VALUES
('Review quarterly goals', 'Analyze progress on Q1 objectives and adjust Q2 planning', 'pending', 1, 60, auth.uid()),
('Organize digital workspace', 'Clean up files, folders, and digital tools for better productivity', 'active', 2, 120, auth.uid()),
('Learn new productivity technique', 'Research and implement a new time management method', 'pending', 3, 90, auth.uid());

-- Insert sample modules
INSERT INTO modules (name, description, type, config, triggers, actions, user_id) VALUES
('Daily Review Automation', 'Automatically create daily review tasks', 'automation', 
 '{"frequency": "daily", "time": "18:00"}',
 '[{"type": "schedule", "condition": "daily_18:00"}]',
 '[{"type": "create_action", "title": "Daily Review", "priority": 2}]',
 auth.uid()),
('Project Completion Trigger', 'Trigger actions when a project is marked complete', 'trigger',
 '{"event": "project_complete"}',
 '[{"type": "status_change", "condition": "project_status_complete"}]',
 '[{"type": "create_celebration", "type": "archive_materials"}]',
 auth.uid());
