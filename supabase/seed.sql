-- Playground用のテストユーザーを追加
INSERT INTO users (id, name) VALUES ('00000000-0000-0000-0000-000000000001', 'Playground User')
ON CONFLICT (id) DO NOTHING;