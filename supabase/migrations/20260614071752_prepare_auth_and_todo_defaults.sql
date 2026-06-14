-- 1. todosテーブルのuser_idの外部キー制約を一旦削除
AlTER TABLE todos DROP CONSTRAINT todos_user_id_fkey;

-- 2. usersテーブルのidをUUIDに変換
AlTER TABLE users ALTER COLUMN id TYPE UUID USING id::uuid;

-- 3. todosテーブルのuser_idをUUIDに変換
AlTER TABLE todos ALTER COLUMN user_id TYPE UUID USING user_id::uuid;

-- 4. todos.statusのデフォルト値をNOT_STARTEDに変更
AlTER TABLE todos ALTER COLUMN status SET DEFAULT 'NOT_STARTED';

-- 5. 外部キー制約を再追加
AlTER TABLE todos ADD CONSTRAINT todos_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id);

-- 6. Playground用のテストユーザーを追加
INSERT INTO users (id, name) VALUES ('00000000-0000-0000-0000-000000000001', 'Playground User')
ON CONFLICT (id) DO NOTHING;