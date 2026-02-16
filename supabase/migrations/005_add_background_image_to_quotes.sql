-- Add background_image column to quotes table
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS background_image TEXT;

-- Update quotes with background images (using actual UUIDs from database)
UPDATE public.quotes SET background_image = 'alley.png' WHERE id = 'de2df9f7-a597-4817-b0bc-0cc87a5d6c30'; -- Thors Snorresson
UPDATE public.quotes SET background_image = 'morning-sun.png' WHERE id = 'db521d1e-7e94-47bd-a8b4-ceb71b41db8a'; -- Marc Aurèle
UPDATE public.quotes SET background_image = 'mountain-sunset.png' WHERE id = '2af3e87c-8e9e-41da-a601-3d58f73829b3'; -- Bruce Lee (difficile)
UPDATE public.quotes SET background_image = 'bambou-forest.png' WHERE id = '2f17ff88-b467-4d96-a5ee-52a07691b5e7'; -- Gildarts Clive
UPDATE public.quotes SET background_image = 'sommet-colline.png' WHERE id = '6c1484be-0382-4485-8f6c-522188eb7b0c'; -- Musashi Miyamoto
UPDATE public.quotes SET background_image = 'train-galaxy.png' WHERE id = '01259934-6dd9-4f1d-89ce-3a1fb2f0b214'; -- David Goggins
UPDATE public.quotes SET background_image = 'caverne-dragon.png' WHERE id = 'b96a3f24-a5cc-4489-bbba-136067d50d4f'; -- Guts
UPDATE public.quotes SET background_image = 'city-night-moon.png' WHERE id = '7b55dae4-857f-4dba-809f-220b8b0fadc6'; -- Itoshi Rin
UPDATE public.quotes SET background_image = 'lighthouse-cat.png' WHERE id = '9a90fec3-aea0-4fba-b01e-b57e7cf7a7ea'; -- Nana Shimura
UPDATE public.quotes SET background_image = 'arbre-monde.png' WHERE id = '1943f3b1-1a8d-48c9-b90a-b7ef5b53123b'; -- Rock Lee
UPDATE public.quotes SET background_image = 'ile-flottante-magic.png' WHERE id = '1c7c85fc-a1a1-453f-ab70-8a1c10ce634b'; -- Muhammad Ali
UPDATE public.quotes SET background_image = 'cascade-cachee.png' WHERE id = '02cb8043-8e53-4f53-84b6-53a8e4574321'; -- Bruce Lee (10000 coups)
UPDATE public.quotes SET background_image = 'champs-cristaux.png' WHERE id = 'faf12116-1710-455b-a750-ff2225ce4de1'; -- Mahatma Gandhi
UPDATE public.quotes SET background_image = 'portail.png' WHERE id = '96447347-6b7f-4abc-8e46-e3c6c1d526d8'; -- Alexandre le Grand
UPDATE public.quotes SET background_image = 'train-night.png' WHERE id = '5eb83aff-b666-409f-bb8d-8eb08e195f8e'; -- Edward Elric
UPDATE public.quotes SET background_image = 'desert-diamants.png' WHERE id = '6f6763b2-eb42-450c-8577-10a8d1516a9f'; -- Elias
UPDATE public.quotes SET background_image = 'under-water.png' WHERE id = '78dd9a1d-6762-418b-9666-7e9354163872'; -- Vegeta
UPDATE public.quotes SET background_image = 'bibliotheque-nuage.png' WHERE id = 'db46f8bf-37e0-4d82-94c9-c9b2a56f8bf7'; -- Sénèque
UPDATE public.quotes SET background_image = 'nightbiblio.png' WHERE id = '2d0c4c7d-eb41-4507-b9c3-b85b72e13df6'; -- Saint Augustin
UPDATE public.quotes SET background_image = 'ile-flottante.png' WHERE id = 'b0d35939-2d20-472d-818f-4aef2c5d1660'; -- Mark Zuckerberg
UPDATE public.quotes SET background_image = 'house-view.png' WHERE id = '2b964a9d-ce4c-463d-9be7-58bdfc2a9744'; -- Inconnu (redeviens)
UPDATE public.quotes SET background_image = 'toit-upside.png' WHERE id = '6dba20fb-8df7-4de9-8c22-7907afbd5731'; -- Erwin Smith
UPDATE public.quotes SET background_image = 'champ-lavande.png' WHERE id = '8c14c4f2-57b1-46f7-9ae9-3effb283b494'; -- Lance Armstrong
UPDATE public.quotes SET background_image = 'parc-night.png' WHERE id = '126db1a7-00e2-4fe2-90ad-ec21d6360938'; -- Martin Luther King Jr.
UPDATE public.quotes SET background_image = 'plage-soleil.png' WHERE id = 'bdec9bc5-b38a-4f5c-88b0-8ddb7386a82d'; -- Erza Scarlet
UPDATE public.quotes SET background_image = 'laverie.png' WHERE id = 'e3cccd09-5643-4f17-98b7-152dc946723b'; -- Winston Churchill
UPDATE public.quotes SET background_image = 'ville-enneige.png' WHERE id = 'b5450bb8-dc6a-45bb-971e-06c682b743a2'; -- Jean-Paul Sartre
UPDATE public.quotes SET background_image = 'cuisine-lemon.png' WHERE id = 'd6f7ab94-8edb-4704-acab-75ce12836500'; -- Sung Jin-Woo
UPDATE public.quotes SET background_image = 'rue-restaurant.png' WHERE id = '5fbf37e6-aa04-4212-9243-fbc578c41d15'; -- Inconnu (pour gagner)
UPDATE public.quotes SET background_image = 'Gemini_Generated_Image_8zdx9q8zdx9q8zdx.png' WHERE id = '57ecb87a-a3ec-41d8-b013-617ab805410d'; -- Monkey D. Luffy

