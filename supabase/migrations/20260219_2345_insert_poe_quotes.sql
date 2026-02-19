-- Migration : Insertion des citations de Path of Exile
-- Ces citations apportent une touche de Stoïcisme et de Mental brut à AURA.

INSERT INTO public.quotes (text, author, source, category, aura_level, background_image)
VALUES
  ('L''exil est une école de survie, mais peu en sortent diplômés.', 'Dominus', 'Path of Exile', 'Mental', 94, NULL),
  ('Pourquoi lutter ? Tout ce qui est construit doit un jour s''effondrer.', 'Sirus', 'Path of Exile', 'Stoïcisme', 98, NULL),
  ('La mort n''est pas une fin, c''est une libération de la chair.', 'Malachai', 'Path of Exile', 'Mental', 95, NULL),
  ('Le monde n''est qu''une illusion, Exilé.', 'Dominus', 'Path of Exile', 'Mental', 100, NULL),
  ('Un homme n''est rien sans son ambition, mais l''ambition sans pouvoir est une agonie.', 'Izaro', 'Path of Exile', 'Ambition', 97, NULL),
  ('Là où il y a une volonté, il y a un chemin. Là où il y a un Golden Key, il y a une porte.', 'Izaro', 'Path of Exile', 'Discipline', 91, NULL),
  ('Regarde dans l''abîme, et l''abîme te montrera qui tu es vraiment.', 'L''Ancien (The Elder)', 'Path of Exile', 'Mental', 96, NULL),
  ('La justice est une balance : d''un côté l''ordre, de l''autre le chaos.', 'Izaro', 'Path of Exile', 'Stoïcisme', 93, NULL),
  ('Ressens-tu le néant ? C''est le futur que je t''offre.', 'Sirus', 'Path of Exile', 'Ambition', 99, NULL),
  ('Pour vivre, il faut être prêt à tout sacrifier, même son humanité.', 'Piety', 'Path of Exile', 'Discipline', 92, NULL);
