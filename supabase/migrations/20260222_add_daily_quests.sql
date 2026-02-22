-- Types d'actions limités pour garantir la cohérence
CREATE TYPE quest_action_type AS ENUM (
  'READ_QUOTES', 
  'SHARE_QUOTE', 
  'ADD_FAVORITE', 
  'STREAK_DAYS'
);

-- Définition des quêtes disponibles dans le pool
CREATE TABLE daily_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action_type quest_action_type NOT NULL,
  target_value INT NOT NULL,
  xp_reward INT DEFAULT 10,
  aura_reward INT DEFAULT 5,
  bonus_rewards JSONB DEFAULT '{}'::jsonb, -- Ex: {"badge": "iron_heart", "multiplier": 1.5}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progression quotidienne des utilisateurs
CREATE TABLE user_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES daily_quests(id) ON DELETE CASCADE,
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  current_progress INT DEFAULT 0,
  is_completed BOOLEAN GENERATED ALWAYS AS (current_progress >= 0) STORED, -- Note: this requires duplicating target_value or updating via application, simpler to make is_completed BOOLEAN DEFAULT FALSE
  completed_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ, -- Pour savoir si la récompense a été réclamée
  
  UNIQUE(user_id, quest_id, assigned_date)
);

-- Note about is_completed above: 
-- Postgres GENERATED ALWAYS AS cannot access other columns across relations. We must drop the generated part and just use a standard boolean.
ALTER TABLE user_quests DROP COLUMN is_completed;
ALTER TABLE user_quests ADD COLUMN is_completed BOOLEAN DEFAULT FALSE;

-- RLS (Row Level Security)
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Les utilisateurs lisent leurs propres quêtes" ON user_quests FOR SELECT USING (auth.uid() = user_id);
-- Insert/Update rights for authenticated users to update their progress
CREATE POLICY "Les utilisateurs modifient/inserent leurs propres quêtes" ON user_quests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Les utilisateurs peuvent se voir assigner des quetes" ON user_quests FOR INSERT WITH CHECK (auth.uid() = user_id);


-- Seed some basic quests
INSERT INTO daily_quests (title, description, action_type, target_value, xp_reward, aura_reward) VALUES 
('L''Oeil du Lecteur', 'Lis 10 citations aujourd''hui.', 'READ_QUOTES', 10, 15, 5),
('Le Choix du Héros', 'Ajoute 1 citation à tes favoris.', 'ADD_FAVORITE', 1, 10, 5),
('Propagation de l''Aura', 'Partage 1 citation avec tes alliés.', 'SHARE_QUOTE', 1, 15, 5),
('Endurance de Fer', 'Atteins 3 jours de streak.', 'STREAK_DAYS', 3, 30, 10),
('Marathonien de la Pensée', 'Lis 25 citations aujourd''hui.', 'READ_QUOTES', 25, 30, 10);
