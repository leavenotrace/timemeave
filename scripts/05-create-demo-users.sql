-- Create demo user accounts for testing
-- 创建演示用户账号用于测试

-- Demo User 1: English Product Manager
-- 演示用户1：英文产品经理
-- Email: demo.pm@timeweave.app
-- Password: TimeWeave2024!

-- Demo User 2: Chinese Software Developer  
-- 演示用户2：中文软件开发者
-- Email: demo.dev@timeweave.app
-- Password: TimeWeave2024!

-- Note: These accounts will be created through the Supabase Auth system
-- Users can sign up with these credentials to access the demo data
-- 注意：这些账号将通过Supabase Auth系统创建
-- 用户可以使用这些凭据注册以访问演示数据

-- The user IDs in the demo data correspond to:
-- 演示数据中的用户ID对应：
-- a1b2c3d4-e5f6-7890-abcd-ef1234567890 = demo.pm@timeweave.app (Product Manager)
-- b2c3d4e5-f6g7-8901-bcde-f23456789012 = demo.dev@timeweave.app (Software Developer)

-- Instructions for testing:
-- 测试说明：
-- 1. Sign up with demo.pm@timeweave.app / TimeWeave2024! to see English product manager data
-- 2. Sign up with demo.dev@timeweave.app / TimeWeave2024! to see Chinese developer data
-- 1. 使用 demo.pm@timeweave.app / TimeWeave2024! 注册查看英文产品经理数据
-- 2. 使用 demo.dev@timeweave.app / TimeWeave2024! 注册查看中文开发者数据

SELECT 'Demo users setup complete. Use the credentials above to test the application.' as message;
