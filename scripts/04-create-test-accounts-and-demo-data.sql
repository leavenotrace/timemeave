-- Create test accounts and comprehensive demo data for TimeWeave
-- 创建测试账号和TimeWeave的综合演示数据

-- Test Account 1: English User (Product Manager)
-- 测试账号1：英文用户（产品经理）
DO $$
DECLARE
    user1_id UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    user2_id UUID := 'b2c3d4e5-f6g7-8901-bcde-f23456789012';
BEGIN

-- Graph nodes for User 1 (English - Product Manager)
-- 用户1的图节点（英文 - 产品经理）
INSERT INTO public.graph (id, user_id, title, content, type, tags, metadata, created_at) VALUES
(gen_random_uuid(), user1_id, 'Product Roadmap Q1 2024', 
 'Key features planned for Q1: User authentication, Dashboard redesign, Mobile app MVP, API v2.0. Success metrics: 25% user growth, 40% engagement increase.', 
 'document', ARRAY['product', 'roadmap', 'planning'], 
 '{"priority": "high", "status": "active", "team": "product"}', 
 NOW() - INTERVAL '5 days'),

(gen_random_uuid(), user1_id, 'Customer Interview - Sarah Chen', 
 'Pain points: Complex onboarding, missing mobile features, slow dashboard loading. Positive feedback: Love the automation features, great customer support. Action items: Simplify signup flow, prioritize mobile development.', 
 'note', ARRAY['research', 'customer', 'interview'], 
 '{"customer_segment": "enterprise", "satisfaction": 8, "interview_date": "2024-01-15"}', 
 NOW() - INTERVAL '3 days'),

(gen_random_uuid(), user1_id, 'Competitive Analysis Framework', 
 'Framework for analyzing competitors: 1) Feature comparison matrix 2) Pricing analysis 3) User experience audit 4) Market positioning 5) SWOT analysis. Update quarterly.', 
 'template', ARRAY['analysis', 'competition', 'framework'], 
 '{"usage_count": 12, "last_updated": "2024-01-10"}', 
 NOW() - INTERVAL '7 days'),

(gen_random_uuid(), user1_id, 'Team Meeting Notes - Jan 18', 
 'Attendees: John, Maria, Alex, Lisa. Discussed: Sprint review, upcoming releases, resource allocation. Decisions: Hire 2 more developers, extend Q1 deadline by 2 weeks, implement new testing process.', 
 'document', ARRAY['meeting', 'team', 'decisions'], 
 '{"meeting_type": "weekly", "duration": 60, "action_items": 5}', 
 NOW() - INTERVAL '1 day'),

(gen_random_uuid(), user1_id, 'User Persona: Tech-Savvy Professional', 
 'Demographics: 28-45 years old, works in tech/finance, high income. Behaviors: Early adopter, values efficiency, uses multiple devices. Goals: Streamline workflows, stay organized, save time. Pain points: Tool fragmentation, information overload.', 
 'reference', ARRAY['persona', 'user-research', 'target-audience'], 
 '{"confidence_level": "high", "research_basis": "50+ interviews"}', 
 NOW() - INTERVAL '10 days');

-- Actions for User 1 (English - Product Manager)
-- 用户1的行动项（英文 - 产品经理）
INSERT INTO public.actions (id, user_id, title, description, status, priority, estimated_time, actual_time, tags, metadata, created_at) VALUES
(gen_random_uuid(), user1_id, 'Review Q1 OKRs with Leadership', 
 'Present Q1 objectives and key results to executive team. Prepare slides, gather supporting data, and schedule follow-up meetings.', 
 'pending', 1, 120, NULL, ARRAY['okr', 'leadership', 'presentation'], 
 '{"deadline": "2024-01-25", "stakeholders": ["CEO", "CTO", "VP Sales"]}', 
 NOW() - INTERVAL '2 days'),

(gen_random_uuid(), user1_id, 'Conduct User Testing Session', 
 'Organize and facilitate user testing for new dashboard design. Recruit 8 participants, prepare test scenarios, document findings.', 
 'active', 2, 240, 180, ARRAY['user-testing', 'research', 'dashboard'], 
 '{"participants": 8, "completion": 75, "insights": 12}', 
 NOW() - INTERVAL '4 days'),

(gen_random_uuid(), user1_id, 'Update Product Requirements Document', 
 'Revise PRD based on recent customer feedback and technical constraints. Include new user stories, acceptance criteria, and wireframes.', 
 'completed', 2, 90, 105, ARRAY['documentation', 'requirements', 'prd'], 
 '{"version": "2.1", "pages": 24, "stakeholder_approval": true}', 
 NOW() - INTERVAL '6 days'),

(gen_random_uuid(), user1_id, 'Analyze Competitor Feature Launch', 
 'Deep dive into competitor''s new AI feature. Assess impact on our market position and identify opportunities for differentiation.', 
 'folded', 3, 60, NULL, ARRAY['competitive-analysis', 'ai', 'strategy'], 
 '{"competitor": "TechCorp", "feature": "AI Assistant", "threat_level": "medium"}', 
 NOW() - INTERVAL '1 day'),

(gen_random_uuid(), user1_id, 'Plan Sprint Retrospective', 
 'Organize team retrospective meeting. Prepare agenda, gather feedback forms, book meeting room, and send calendar invites.', 
 'pending', 3, 45, NULL, ARRAY['agile', 'retrospective', 'team'], 
 '{"sprint": "Sprint 23", "team_size": 8, "format": "hybrid"}', 
 NOW());

-- Modules for User 1 (English - Product Manager)
-- 用户1的模块（英文 - 产品经理）
INSERT INTO public.modules (id, user_id, name, description, type, trigger_conditions, actions, is_active, execution_count, metadata, created_at) VALUES
(gen_random_uuid(), user1_id, 'Weekly Metrics Dashboard', 
 'Automatically compile and send weekly product metrics report every Friday at 4 PM.', 
 'automation', 
 '{"type": "schedule", "day": "friday", "time": "16:00", "timezone": "UTC"}',
 '{"actions": [{"type": "generate_report", "metrics": ["user_growth", "engagement", "churn"]}, {"type": "send_email", "recipients": ["team@company.com"]}]}',
 true, 12, 
 '{"last_execution": "2024-01-19", "success_rate": 100, "avg_generation_time": 45}', 
 NOW() - INTERVAL '15 days'),

(gen_random_uuid(), user1_id, 'Customer Feedback Processor', 
 'When new customer feedback is received, automatically categorize and create action items for high-priority issues.', 
 'trigger', 
 '{"type": "webhook", "source": "feedback_system", "conditions": {"rating": "<=3"}}',
 '{"actions": [{"type": "categorize", "categories": ["bug", "feature_request", "usability"]}, {"type": "create_action", "priority": 1, "assign_to": "product_team"}]}',
 true, 28, 
 '{"categories_created": {"bug": 12, "feature_request": 8, "usability": 8}, "actions_created": 28}', 
 NOW() - INTERVAL '20 days'),

(gen_random_uuid(), user1_id, 'Product Launch Checklist', 
 'Template for product launch preparation with all necessary steps and stakeholder approvals.', 
 'template', 
 '{"type": "manual", "trigger": "product_launch"}',
 '{"actions": [{"type": "create_graph_node", "title": "Launch Plan", "template": "launch_checklist"}, {"type": "create_actions", "count": 15, "categories": ["marketing", "engineering", "support"]}]}',
 false, 3, 
 '{"launches_supported": 3, "avg_tasks_created": 15, "success_rate": 100}', 
 NOW() - INTERVAL '30 days');

-- Graph nodes for User 2 (Chinese - Software Developer)
-- 用户2的图节点（中文 - 软件开发者）
INSERT INTO public.graph (id, user_id, title, content, type, tags, metadata, created_at) VALUES
(gen_random_uuid(), user2_id, '微服务架构设计方案', 
 '项目采用微服务架构，包含用户服务、订单服务、支付服务、通知服务。技术栈：Spring Boot + Docker + Kubernetes + Redis + MySQL。关键考虑：服务拆分粒度、数据一致性、服务间通信、监控告警。', 
 'document', ARRAY['架构', '微服务', '设计'], 
 '{"技术栈": ["Spring Boot", "Docker", "Kubernetes"], "状态": "设计中", "优先级": "高"}', 
 NOW() - INTERVAL '4 days'),

(gen_random_uuid(), user2_id, 'React性能优化笔记', 
 '性能优化技巧总结：1) 使用React.memo避免不必要渲染 2) useMemo和useCallback优化计算 3) 代码分割和懒加载 4) 虚拟滚动处理大列表 5) 图片懒加载和压缩。实际项目中首屏加载时间从3.2s优化到1.1s。', 
 'note', ARRAY['React', '性能优化', '前端'], 
 '{"优化效果": "首屏时间减少65%", "应用项目": "电商平台", "更新时间": "2024-01-12"}', 
 NOW() - INTERVAL '6 days'),

(gen_random_uuid(), user2_id, 'API接口设计规范', 
 'RESTful API设计标准：1) 使用HTTP动词表示操作 2) 资源命名使用复数形式 3) 统一错误码和响应格式 4) 版本控制策略 5) 认证和授权机制 6) 限流和缓存策略。包含具体示例和最佳实践。', 
 'template', ARRAY['API', '规范', '后端'], 
 '{"使用次数": 8, "团队采用": true, "最后更新": "2024-01-08"}', 
 NOW() - INTERVAL '8 days'),

(gen_random_uuid(), user2_id, '数据库优化实战记录', 
 '电商系统数据库优化案例：订单表查询从2.5s优化到200ms。优化措施：1) 添加复合索引 2) 分区表设计 3) 读写分离 4) 查询语句重构 5) 缓存策略。详细记录了优化前后的执行计划对比。', 
 'reference', ARRAY['数据库', '优化', 'MySQL'], 
 '{"优化效果": "查询速度提升92%", "涉及表": "orders, order_items", "优化日期": "2024-01-10"}', 
 NOW() - INTERVAL '2 days'),

(gen_random_uuid(), user2_id, '团队代码评审总结', 
 '本周代码评审发现的问题：1) 异常处理不够完善 2) 单元测试覆盖率偏低 3) 代码注释不足 4) 变量命名不规范。改进建议：制定代码规范文档，增加自动化检查工具，定期技术分享。', 
 'document', ARRAY['代码评审', '团队', '质量'], 
 '{"评审轮次": "第3周", "问题数量": 15, "团队成员": 6}', 
 NOW() - INTERVAL '1 day');

-- Actions for User 2 (Chinese - Software Developer)
-- 用户2的行动项（中文 - 软件开发者）
INSERT INTO public.actions (id, user_id, title, description, status, priority, estimated_time, actual_time, tags, metadata, created_at) VALUES
(gen_random_uuid(), user2_id, '完成用户认证模块开发', 
 '实现JWT认证、密码加密、权限控制等功能。包括单元测试和集成测试，确保安全性和稳定性。需要与前端团队协调接口对接。', 
 'active', 1, 480, 360, ARRAY['开发', '认证', '后端'], 
 '{"进度": "75%", "剩余工作": ["权限控制", "集成测试"], "协作团队": "前端团队"}', 
 NOW() - INTERVAL '5 days'),

(gen_random_uuid(), user2_id, '优化商品搜索接口性能', 
 '当前搜索接口响应时间过长，需要优化数据库查询、添加缓存机制、改进搜索算法。目标：响应时间从1.5s降低到300ms以内。', 
 'pending', 1, 240, NULL, ARRAY['性能优化', '搜索', 'API'], 
 '{"当前响应时间": "1.5s", "目标响应时间": "300ms", "优化方案": ["数据库索引", "Redis缓存", "算法优化"]}', 
 NOW() - INTERVAL '2 days'),

(gen_random_uuid(), user2_id, '编写技术文档', 
 '为新开发的支付模块编写详细的技术文档，包括架构设计、接口说明、部署指南、故障排查等内容，方便团队成员理解和维护。', 
 'completed', 2, 180, 210, ARRAY['文档', '支付', '技术'], 
 '{"文档页数": 32, "包含图表": 8, "审核状态": "已通过"}', 
 NOW() - INTERVAL '7 days'),

(gen_random_uuid(), user2_id, '参加架构评审会议', 
 '参与新项目的架构评审，准备技术方案演示，讨论技术选型和实现细节。需要提前准备PPT和demo演示。', 
 'folded', 2, 120, NULL, ARRAY['会议', '架构', '评审'], 
 '{"会议时间": "2024-01-22 14:00", "参与人员": 8, "准备材料": ["PPT", "技术方案", "demo"]}', 
 NOW() - INTERVAL '3 days'),

(gen_random_uuid(), user2_id, '学习Kubernetes部署', 
 '深入学习K8s容器编排，掌握Pod、Service、Deployment等核心概念，完成实际项目的容器化部署。制定学习计划和实践项目。', 
 'pending', 3, 360, NULL, ARRAY['学习', 'Kubernetes', '容器'], 
 '{"学习资源": ["官方文档", "实战课程", "开源项目"], "实践项目": "微服务部署"}', 
 NOW());

-- Modules for User 2 (Chinese - Software Developer)
-- 用户2的模块（中文 - 软件开发者）
INSERT INTO public.modules (id, user_id, name, description, type, trigger_conditions, actions, is_active, execution_count, metadata, created_at) VALUES
(gen_random_uuid(), user2_id, '每日代码统计报告', 
 '每天晚上自动统计代码提交情况，生成个人开发报告，包括代码行数、提交次数、bug修复等指标。', 
 'automation', 
 '{"type": "schedule", "time": "22:00", "frequency": "daily", "timezone": "Asia/Shanghai"}',
 '{"actions": [{"type": "collect_git_stats", "repositories": ["main_project", "utils_lib"]}, {"type": "generate_report", "format": "markdown"}, {"type": "save_to_graph", "category": "daily_stats"}]}',
 true, 25, 
 '{"最后执行": "2024-01-19", "平均代码行数": 156, "成功率": 96}', 
 NOW() - INTERVAL '25 days'),

(gen_random_uuid(), user2_id, '生产环境异常监控', 
 '监控生产环境异常，当错误率超过阈值时自动创建紧急任务并发送通知给相关人员。', 
 'trigger', 
 '{"type": "webhook", "source": "monitoring_system", "conditions": {"error_rate": ">5%", "duration": ">5min"}}',
 '{"actions": [{"type": "create_action", "title": "处理生产异常", "priority": 1, "tags": ["紧急", "生产", "异常"]}, {"type": "send_notification", "channels": ["slack", "email"], "recipients": ["dev_team", "ops_team"]}]}',
 true, 7, 
 '{"触发次数": 7, "平均响应时间": "3分钟", "问题解决率": 100}', 
 NOW() - INTERVAL '18 days'),

(gen_random_uuid(), user2_id, '技术学习计划模板', 
 '创建新技术学习计划的模板，自动生成学习路径、实践项目和进度跟踪任务。', 
 'template', 
 '{"type": "manual", "trigger": "new_technology_learning"}',
 '{"actions": [{"type": "create_graph_node", "title": "学习计划", "template": "learning_plan"}, {"type": "create_actions", "categories": ["理论学习", "实践项目", "总结分享"], "count": 10}]}',
 false, 4, 
 '{"使用次数": 4, "涉及技术": ["React", "Docker", "GraphQL", "TypeScript"], "完成率": 85}', 
 NOW() - INTERVAL '40 days');

END $$;
