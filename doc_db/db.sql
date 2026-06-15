USE ytalk_forum;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM votes_messages;
DELETE FROM messages;
DELETE FROM topic_tags;
DELETE FROM tags;
DELETE FROM topics;
DELETE FROM utilisateurs;

ALTER TABLE votes_messages AUTO_INCREMENT = 1;
ALTER TABLE messages AUTO_INCREMENT = 1;
ALTER TABLE tags AUTO_INCREMENT = 1;
ALTER TABLE topics AUTO_INCREMENT = 1;
ALTER TABLE utilisateurs AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================
-- UTILISATEURS
-- =========================
-- admin : Admin123!
-- utilisateurs : Azerty123!

INSERT INTO utilisateurs (id, pseudo, email, mot_de_passe, role, banni)
VALUES
(1, 'admin', 'admin@ecoleinfo.fr', SHA2('Admin123!', 512), 'admin', 0),
(2, 'nathan', 'nathan@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(3, 'camille', 'camille@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(4, 'yanis', 'yanis@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(5, 'emma', 'emma@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(6, 'leo', 'leo@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(7, 'ines', 'ines@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(8, 'adam', 'adam@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(9, 'chloe', 'chloe@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(10, 'mehdi', 'mehdi@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(11, 'lucas', 'lucas@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(12, 'sarah', 'sarah@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(13, 'antoine', 'antoine@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(14, 'mila', 'mila@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(15, 'tom', 'tom@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(16, 'zoe', 'zoe@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 0),
(17, 'banni_test', 'banni@ecoleinfo.fr', SHA2('Azerty123!', 512), 'utilisateur', 1);

-- =========================
-- TAGS
-- =========================

INSERT INTO tags (id, nom)
VALUES
(1, 'general'),
(2, 'cours'),
(3, 'html'),
(4, 'css'),
(5, 'javascript'),
(6, 'mysql'),
(7, 'reseau'),
(8, 'linux'),
(9, 'cybersecurite'),
(10, 'stage'),
(11, 'alternance'),
(12, 'examens'),
(13, 'entraide'),
(14, 'materiel'),
(15, 'vie-ecole'),
(16, 'cafeteria'),
(17, 'delire'),
(18, 'meme'),
(19, 'bug'),
(20, 'nuit-blanche'),
(21, 'admin'),
(22, 'annonce'),
(23, 'orientation'),
(24, 'revision'),
(25, 'projet-groupe'),
(26, 'pause');

-- =========================
-- TOPICS
-- =========================

INSERT INTO topics (id, titre, contenu, auteur_id, etat)
VALUES
(1, 'Bienvenue sur le forum de l’école', 'Bienvenue à tous. Ce forum sert à poser des questions, partager des ressources et échanger entre étudiants de l’école.', 1, 'ouvert'),

(2, 'Conseils pour bien commencer en première année', 'Je viens d’arriver dans l’école et je voulais savoir quels conseils vous auriez pour bien suivre les cours dès le début.', 2, 'ouvert'),

(3, 'Ressources utiles pour apprendre JavaScript', 'Je cherche des sites, vidéos ou exercices pour mieux comprendre JavaScript, surtout les fonctions et les événements.', 3, 'ouvert'),

(4, 'Problème avec une requête MySQL', 'J’ai une requête SQL qui ne retourne pas le bon résultat. Je pense que le problème vient de ma jointure.', 4, 'ouvert'),

(5, 'Quel ordinateur choisir pour les cours ?', 'Je dois changer de PC portable. Vous conseillez quoi pour coder, faire tourner des machines virtuelles et tenir toute la journée ?', 5, 'ouvert'),

(6, 'Recherche groupe pour réviser le réseau', 'Je cherche des personnes motivées pour réviser les bases réseau : IP, DNS, DHCP, routage et tout le reste.', 6, 'ouvert'),

(7, 'Stage de première année : où chercher ?', 'Je commence à chercher un stage et je ne sais pas trop par où commencer. Vous avez des conseils ou des sites utiles ?', 7, 'ouvert'),

(8, 'Alternance : comment préparer son entretien ?', 'Je vais bientôt passer un entretien pour une alternance en développement web. Quels types de questions peuvent tomber ?', 8, 'ouvert'),

(9, 'Linux me déteste officiellement', 'J’ai voulu installer Linux en dual boot et maintenant mon PC démarre sur un écran noir. Je pense que Linux m’a jugé.', 9, 'ouvert'),

(10, 'Partage de fiches de révision', 'Si vous avez des fiches de révision propres pour les cours d’algorithmique, base de données ou réseau, partagez ici.', 10, 'ouvert'),

(11, 'La cafétéria est-elle ouverte le vendredi ?', 'Petite question importante : est-ce que la cafétéria est ouverte le vendredi après-midi ou il faut prévoir son goûter de survie ?', 11, 'ouvert'),

(12, 'Débat : VS Code ou JetBrains ?', 'Chacun défend son éditeur préféré ici, mais dans le respect. Même les utilisateurs de Notepad++ sont acceptés.', 12, 'ouvert'),

(13, 'Comment gérer un projet de groupe sans crise ?', 'On commence un projet de groupe et je sens déjà que les fichiers vont s’appeler final_v2_vrai_final.zip.', 13, 'ouvert'),

(14, 'Besoin d’aide sur les boucles en algorithmique', 'Je bloque encore sur les boucles imbriquées. J’arrive à lire le code, mais pas toujours à savoir ce qu’il va afficher.', 14, 'ouvert'),

(15, 'Examens blancs : comment vous révisez ?', 'Vous révisez plutôt avec des fiches, des exercices, des vidéos ou en paniquant la veille à 23h ?', 15, 'ouvert'),

(16, 'Topic fermé : annonce ancienne', 'Ce topic est une ancienne annonce fermée. Il reste visible, mais personne ne peut répondre.', 1, 'ferme'),

(17, 'Topic archivé : ancien planning de rentrée', 'Ancien planning de rentrée archivé. Il ne doit plus apparaître dans la liste principale des topics.', 1, 'archive'),

(18, 'Le bug qui disparaît quand le prof arrive', 'J’avais une erreur pendant deux heures. Le prof arrive, je relance, tout marche. Mon code a peur de l’autorité.', 16, 'ouvert'),

(19, 'Qui a cassé le Wi-Fi de la salle 204 ?', 'Le Wi-Fi marche dans le couloir, dans les escaliers, mais pas dans la salle 204. Je soupçonne les murs d’être anti-étudiants.', 2, 'ouvert'),

(20, 'Team nuit blanche avant examen', 'Si tu lis ce message après minuit avec un café à côté, tu fais officiellement partie de la team nuit blanche.', 3, 'ouvert'),

(21, 'Idées de snacks pour survivre aux longues journées', 'Je cherche des idées de snacks qui ne font pas trop de bruit en salle et qui évitent de s’endormir en cours.', 4, 'ouvert'),

(22, 'Les meilleurs memes de dev', 'Postez ici vos blagues et memes de développeur. Attention, les jeux de mots SQL sont autorisés mais surveillés.', 5, 'ouvert'),

(23, 'Question sur la cybersécurité', 'Je voudrais comprendre la différence entre une faille XSS et une injection SQL avec des exemples simples.', 6, 'ouvert'),

(24, 'Cherche binôme pour travailler HTML/CSS', 'Je cherche quelqu’un pour travailler HTML/CSS après les cours. Objectif : arrêter de se battre avec les div.', 7, 'ouvert'),

(25, 'Topic fermé : trop de hors sujet', 'Ce topic est fermé parce que la discussion est partie beaucoup trop loin.', 1, 'ferme'),

(26, 'Topic archivé : ancien débat sur les claviers mécaniques', 'Ancien débat archivé parce que personne n’était d’accord sur les switches bleus.', 1, 'archive'),

(27, 'Comment organiser ses dossiers de cours ?', 'Entre les PDF, les exercices, les projets et les captures d’écran, mon bureau ressemble à une zone de guerre.', 8, 'ouvert'),

(28, 'Oral de présentation : conseils ?', 'Je dois présenter un sujet technique devant la classe et je stresse un peu. Vous avez des conseils pour être plus à l’aise ?', 9, 'ouvert'),

(29, 'Besoin d’explication sur les API', 'Je comprends l’idée générale d’une API, mais je ne vois pas encore bien comment le front et le back communiquent.', 10, 'ouvert'),

(30, 'Pause détente : raconte ton plus gros bug', 'Topic détente : racontez le bug le plus absurde que vous avez eu depuis le début de l’année.', 11, 'ouvert');

-- =========================
-- TOPIC_TAGS
-- =========================

INSERT INTO topic_tags (topic_id, tag_id)
VALUES
(1, 1), (1, 15), (1, 22),

(2, 1), (2, 2), (2, 23),

(3, 5), (3, 13), (3, 24),

(4, 6), (4, 13), (4, 19),

(5, 14), (5, 2), (5, 15),

(6, 7), (6, 13), (6, 24),

(7, 10), (7, 23), (7, 13),

(8, 11), (8, 23), (8, 13),

(9, 8), (9, 19), (9, 17),

(10, 2), (10, 24), (10, 13),

(11, 16), (11, 15), (11, 26),

(12, 2), (12, 17), (12, 18),

(13, 25), (13, 17), (13, 19),

(14, 2), (14, 13), (14, 24),

(15, 12), (15, 24), (15, 20),

(16, 21), (16, 22),

(17, 21), (17, 22),

(18, 19), (18, 17), (18, 18),

(19, 7), (19, 17), (19, 15),

(20, 12), (20, 20), (20, 26),

(21, 16), (21, 26), (21, 17),

(22, 18), (22, 17), (22, 26),

(23, 9), (23, 6), (23, 13),

(24, 3), (24, 4), (24, 13),

(25, 21), (25, 17),

(26, 14), (26, 17),

(27, 2), (27, 15), (27, 13),

(28, 12), (28, 23), (28, 13),

(29, 5), (29, 13), (29, 2),

(30, 17), (30, 19), (30, 18);

-- =========================
-- MESSAGES
-- =========================

INSERT INTO messages (id, topic_id, auteur_id, contenu)
VALUES
(1, 1, 1, 'Bienvenue à tous sur le forum. Pensez à rester respectueux et à mettre des tags utiles sur vos topics.'),
(2, 1, 2, 'Salut, moi c’est Nathan. Je suis en première année et je découvre le forum.'),
(3, 1, 5, 'Trop bien, ça peut vraiment aider pour les cours et les révisions.'),
(4, 1, 8, 'Bonjour tout le monde, j’espère qu’on pourra partager pas mal de ressources ici.'),

(5, 2, 2, 'Je galère surtout à m’organiser entre les cours, les exercices et les projets.'),
(6, 2, 3, 'Le mieux c’est de relire les cours le soir même, même rapidement.'),
(7, 2, 10, 'Fais des petits exercices souvent. Attendre la veille du contrôle c’est dangereux.'),
(8, 2, 1, 'Bon conseil : ne négligez pas les bases, surtout l’algorithmique et SQL.'),

(9, 3, 3, 'J’ai commencé avec MDN, c’est assez clair pour JavaScript.'),
(10, 3, 6, 'Les petits exercices sur les tableaux et les fonctions aident beaucoup.'),
(11, 3, 12, 'Je conseille aussi de refaire les exemples du cours sans regarder la correction.'),

(12, 4, 4, 'Je crois que ma jointure me duplique les lignes.'),
(13, 4, 1, 'Regarde si tu n’as pas une relation plusieurs-à-plusieurs qui multiplie les résultats.'),
(14, 4, 9, 'Tu peux aussi tester ta requête morceau par morceau.'),

(15, 5, 5, 'Je pensais prendre un PC avec 16 Go de RAM, vous pensez que c’est suffisant ?'),
(16, 5, 13, 'Oui, 16 Go c’est bien. Pour les VM, évite juste les machines trop faibles.'),
(17, 5, 7, 'Pense aussi à l’autonomie, c’est important en journée.'),

(18, 6, 6, 'Je suis chaud pour réviser le réseau mercredi après les cours.'),
(19, 6, 10, 'Moi aussi, surtout DNS et DHCP.'),
(20, 6, 14, 'Je peux ramener mes fiches si ça aide.'),

(21, 7, 7, 'Vous avez utilisé LinkedIn ou Indeed pour chercher un stage ?'),
(22, 7, 5, 'LinkedIn marche bien, mais il faut aussi envoyer des candidatures spontanées.'),
(23, 7, 1, 'N’attendez pas trop longtemps, les places partent vite.'),

(24, 8, 8, 'On m’a demandé mes projets perso au dernier entretien.'),
(25, 8, 12, 'Prépare aussi une présentation rapide de toi et de ce que tu sais faire.'),
(26, 8, 1, 'Important : sois honnête sur ton niveau, mais montre que tu es motivé.'),

(27, 9, 9, 'J’ai réparé le dual boot, mais maintenant Windows me regarde bizarrement.'),
(28, 9, 11, 'Linux ne te déteste pas, il teste ta patience.'),
(29, 9, 4, 'Une clé USB bootable peut sauver une journée entière.'),

(30, 10, 10, 'J’ai une fiche sur les jointures SQL, je peux la partager demain.'),
(31, 10, 3, 'Je veux bien, les jointures c’est encore flou pour moi.'),
(32, 10, 6, 'On pourrait faire un dossier commun avec toutes les fiches.'),

(33, 11, 11, 'J’ai demandé ce matin, apparemment elle ferme plus tôt le vendredi.'),
(34, 11, 15, 'Information vitale, merci pour ton service.'),
(35, 11, 2, 'Donc prévoir sandwich de secours, compris.'),

(36, 12, 12, 'VS Code pour moi, simple et efficace.'),
(37, 12, 13, 'JetBrains est lourd mais super confortable.'),
(38, 12, 4, 'Moi j’utilise VS Code parce que mon PC souffle déjà trop.'),

(39, 13, 13, 'Dans mon groupe, personne n’a la même version du fichier. Ça commence bien.'),
(40, 13, 7, 'Utilisez Git dès le début, sinon ça finit en fichiers envoyés sur Discord.'),
(41, 13, 1, 'Un projet de groupe se gère mieux avec des tâches claires pour chacun.'),

(42, 14, 14, 'Je confonds encore for et while parfois.'),
(43, 14, 3, 'Le for est pratique quand tu connais le nombre de répétitions.'),
(44, 14, 6, 'Fais des tableaux de valeurs, ça aide à suivre les variables.'),

(45, 15, 15, 'Je révise toujours trop tard et après je regrette.'),
(46, 15, 9, 'Les annales et exercices corrigés, c’est le plus efficace pour moi.'),
(47, 15, 2, 'La technique panique à 23h marche rarement, mais on continue tous.'),

(48, 16, 1, 'Annonce fermée. Merci de ne plus répondre ici.'),
(49, 16, 5, 'Message laissé avant fermeture pour tester.'),

(50, 18, 16, 'Je jure que l’erreur a disparu exactement quand le prof a touché le clavier.'),
(51, 18, 8, 'Le code respecte plus le prof que nous.'),
(52, 18, 11, 'C’est le bug timide, il apparaît seulement quand tu es seul.'),

(53, 19, 2, 'Je suis en salle 204 et j’ai deux barres de Wi-Fi quand je lève le bras.'),
(54, 19, 14, 'Essaie de t’asseoir près de la porte, c’est la zone sacrée du réseau.'),
(55, 19, 1, 'Je remonte le souci, mais merci pour le diagnostic très scientifique.'),

(56, 20, 3, 'Il est 1h12 et je viens de comprendre un exercice de boucle. Victoire.'),
(57, 20, 10, 'À 2h du matin, tout semble logique puis plus rien le lendemain.'),
(58, 20, 6, 'Force à la team café et surligneurs.'),

(59, 21, 4, 'Les barres de céréales, c’est pratique et discret.'),
(60, 21, 15, 'Évitez les chips en cours, le bruit trahit tout le monde.'),
(61, 21, 9, 'Le vrai snack étudiant : café + stress.'),

(62, 22, 5, 'Pourquoi les développeurs aiment le sombre ? Parce que la lumière attire les bugs.'),
(63, 22, 12, 'J’ai ri plus que prévu.'),
(64, 22, 1, 'Blague validée, mais surveillée.'),

(65, 23, 6, 'Une XSS touche plutôt ce qui est exécuté dans le navigateur, c’est ça ?'),
(66, 23, 1, 'Oui, alors que l’injection SQL vise la base de données via une requête mal protégée.'),
(67, 23, 11, 'Donc dans les deux cas il faut bien filtrer ce que l’utilisateur envoie.'),

(68, 24, 7, 'Je suis dispo jeudi après les cours pour travailler HTML/CSS.'),
(69, 24, 3, 'Je viens aussi, j’ai besoin de revoir flexbox.'),
(70, 24, 14, 'Moi c’est grid qui me fait peur.'),

(71, 25, 1, 'Topic fermé car trop de hors sujet.'),
(72, 25, 17, 'Message de test par un compte banni.'),

(73, 27, 8, 'J’ai un dossier cours, un dossier cours_final et un dossier vraiment_final.'),
(74, 27, 13, 'Fais un dossier par matière, sinon tu vas souffrir en fin d’année.'),
(75, 27, 5, 'Renommer les fichiers avec la date aide beaucoup.'),

(76, 28, 9, 'Je parle trop vite quand je présente.'),
(77, 28, 12, 'Entraîne-toi avec un chrono, ça aide vraiment.'),
(78, 28, 1, 'Le plus important est de structurer : intro, explication, démo, conclusion.'),

(79, 29, 10, 'Donc le front envoie une demande et le backend répond avec du JSON ?'),
(80, 29, 1, 'Exactement. Le front utilise souvent fetch pour appeler une route du backend.'),
(81, 29, 6, 'Et le backend peut ensuite interroger la base de données.'),

(82, 30, 11, 'Mon plus gros bug : un fichier CSS pas relié au HTML. Deux heures perdues.'),
(83, 30, 4, 'Moi c’était une majuscule dans le nom du fichier. Windows pardonne, pas toujours le serveur.'),
(84, 30, 16, 'J’ai déjà oublié de lancer le serveur et accusé le code pendant 30 minutes.');

-- =========================
-- LIKES / DISLIKES
-- =========================

INSERT INTO votes_messages (message_id, utilisateur_id, vote)
VALUES
(1, 2, 'like'),
(1, 3, 'like'),
(1, 4, 'like'),
(1, 5, 'like'),

(6, 2, 'like'),
(6, 8, 'like'),
(7, 3, 'like'),
(8, 5, 'like'),

(9, 2, 'like'),
(9, 6, 'like'),
(10, 12, 'like'),
(11, 4, 'like'),

(13, 4, 'like'),
(13, 9, 'like'),
(14, 2, 'like'),

(15, 6, 'like'),
(15, 7, 'like'),
(16, 5, 'like'),
(17, 3, 'like'),

(18, 10, 'like'),
(19, 6, 'like'),
(20, 2, 'like'),

(21, 3, 'like'),
(22, 8, 'like'),
(23, 7, 'like'),

(24, 5, 'like'),
(25, 8, 'like'),
(26, 10, 'like'),

(27, 11, 'like'),
(27, 12, 'like'),
(28, 4, 'like'),
(28, 3, 'dislike'),

(30, 3, 'like'),
(30, 4, 'like'),
(31, 10, 'like'),

(33, 15, 'like'),
(34, 11, 'like'),
(35, 2, 'like'),

(36, 5, 'like'),
(37, 6, 'like'),
(38, 9, 'like'),

(39, 7, 'like'),
(40, 13, 'like'),
(41, 5, 'like'),

(42, 3, 'like'),
(43, 14, 'like'),
(44, 2, 'like'),

(45, 6, 'like'),
(46, 15, 'like'),
(47, 8, 'like'),

(50, 2, 'like'),
(50, 3, 'like'),
(51, 16, 'like'),
(52, 11, 'like'),

(53, 14, 'like'),
(54, 2, 'like'),
(55, 9, 'like'),

(56, 10, 'like'),
(56, 6, 'like'),
(57, 3, 'like'),
(58, 5, 'like'),

(59, 15, 'like'),
(60, 4, 'like'),
(60, 8, 'dislike'),
(61, 7, 'like'),

(62, 12, 'like'),
(62, 13, 'like'),
(62, 14, 'like'),
(63, 5, 'like'),

(65, 1, 'like'),
(66, 6, 'like'),
(66, 10, 'like'),
(67, 2, 'like'),

(68, 3, 'like'),
(69, 7, 'like'),
(70, 14, 'like'),

(73, 8, 'like'),
(74, 2, 'like'),
(75, 5, 'like'),

(76, 12, 'like'),
(77, 9, 'like'),
(78, 3, 'like'),

(79, 6, 'like'),
(80, 10, 'like'),
(80, 15, 'like'),
(81, 4, 'like'),

(82, 2, 'like'),
(82, 5, 'like'),
(83, 11, 'like'),
(84, 16, 'like');