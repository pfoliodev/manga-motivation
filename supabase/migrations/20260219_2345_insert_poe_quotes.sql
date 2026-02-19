-- Migration : Insertion des citations de Path of Exile
-- Ces citations apportent une touche de Stoïcisme et de Mental brut à AURA.

INSERT INTO public.quotes (text, author, source, category, aura_level, background_image)
VALUES
  ('L''exil est une école de survie, mais peu en sortent diplômés.', 'Dominus', 'Path of Exile', 'Mental', 94, 'poe/poe01.png'),
  ('Pourquoi lutter ? Tout ce qui est construit doit un jour s''effondrer.', 'Sirus', 'Path of Exile', 'Stoïcisme', 98, 'poe/poe02.png'),
  ('La mort n''est pas une fin, c''est une libération de la chair.', 'Malachai', 'Path of Exile', 'Mental', 95, 'poe/poe03.png'),
  ('Le monde n''est qu''une illusion, Exilé.', 'Dominus', 'Path of Exile', 'Mental', 100, 'poe/poe04.png'),
  ('Un homme n''est rien sans son ambition, mais l''ambition sans pouvoir est une agonie.', 'Izaro', 'Path of Exile', 'Ambition', 97, 'poe/poe05.png'),
  ('Là où il y a une volonté, il y a un chemin. Là où il y a un Golden Key, il y a une porte.', 'Izaro', 'Path of Exile', 'Discipline', 91, 'poe/poe06.png'),
  ('Regarde dans l''abîme, et l''abîme te montrera qui tu es vraiment.', 'L''Ancien (The Elder)', 'Path of Exile', 'Mental', 96, 'poe/poe07.png'),
  ('La justice est une balance : d''un côté l''ordre, de l''autre le chaos.', 'Izaro', 'Path of Exile', 'Stoïcisme', 93, 'poe/poe08.png'),
  ('Ressens-tu le néant ? C''est le futur que je t''offre.', 'Sirus', 'Path of Exile', 'Ambition', 99, 'poe/poe09.png'),
  ('Pour vivre, il faut être prêt à tout sacrifier, même son humanité.', 'Piety', 'Path of Exile', 'Discipline', 92, 'poe/poe10.png');
