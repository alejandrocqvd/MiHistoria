CREATE SCHEMA mi_historia;

USE mi_historia;

CREATE TABLE user
(
    username            VARCHAR(255)    NOT NULL,
    first_name          VARCHAR(70),
    last_name           VARCHAR(70),
    dob                 DATE,
    email               VARCHAR(255)    NOT NULL            UNIQUE,
    password            VARCHAR(255)    NOT NULL,
    image               VARCHAR(255),
    is_private          BOOLEAN         DEFAULT FALSE,
    PRIMARY KEY (username)
);

CREATE TABLE story
(
    username            VARCHAR(255)    NOT NULL,
    title               VARCHAR(255)    NOT NULL,
    page_count          INT,
    is_private          BOOLEAN         DEFAULT FALSE,
    text                MEDIUMTEXT,
    image               VARCHAR(255),
    timestamp           DATETIME        DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (username),
    FOREIGN KEY (username) REFERENCES user(username)
);

CREATE TABLE page
(
    page_number         INT             NOT NULL            AUTO_INCREMENT,
    username            VARCHAR(255)    NOT NULL,
    text                MEDIUMTEXT,
    PRIMARY KEY (page_number, username),
    FOREIGN KEY (username) REFERENCES user(username)
);

CREATE TABLE comment
(
    comment_id          INT             NOT NULL            AUTO_INCREMENT,
    comment_username    VARCHAR(255)    NOT NULL,
    story_username      VARCHAR(255)    NOT NULL,
    text                TEXT            NOT NULL,
    timestamp           DATETIME        NOT NULL,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (comment_username) REFERENCES user(username),
    FOREIGN KEY (story_username) REFERENCES story(username)
);

CREATE TABLE likes_story
(
    like_username       VARCHAR(255)    NOT NULL,
    story_username      VARCHAR(255)    NOT NULL,
    PRIMARY KEY (like_username, story_username),
    FOREIGN KEY (like_username) REFERENCES user(username),
    FOREIGN KEY (story_username) REFERENCES story(username)
);

CREATE TABLE saves
(
    save_username        VARCHAR(255)    NOT NULL,
    story_username       VARCHAR(255)    NOT NULL,
    timestamp            DATETIME        NOT NULL           DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (save_username, story_username),
    FOREIGN KEY (save_username) REFERENCES user(username),
    FOREIGN KEY (story_username) REFERENCES story(username)
);

CREATE TABLE likes_comment
(
    username            VARCHAR(255)    NOT NULL,
    comment_id          INT             NOT NULL,
    PRIMARY KEY (username, comment_id),
    FOREIGN KEY (username) REFERENCES User(username),
    FOREIGN KEY (comment_id) REFERENCES Comment(comment_id)
);

INSERT INTO user
VALUES
("alejandrocqvd", "Alejandro", "Cardona", "2004-05-11", "alejandrocqvd@gmail.com", "$2a$10$cLUQwlbJ/fWDaT7K0Qf54O.6FyReScz4zLNYBaW51hZm3JgaOwdU6", null, null),
("test", "test", "test", "2004-05-11", "test@gmail.com", "$2a$10$cLUQwlbJ/fWDaT7K0Qf54O.6FyReScz4zLNYBaW51hZm3JgaOwdU6", null, null);

INSERT INTO story
VALUES
("alejandrocqvd", "Once Upon a Time in Hollywood", 1, null, "
        <p>
            <strong>Early Life and Education</strong><br></br>
            I was born in 1904 in New York City. My fascination with science began at a young age, 
            influenced by a vibrant, intellectual environment at home. I pursued physics with a passion 
            that eventually took me to Harvard and then to Cambridge and Göttingen for further studies.
        </p>
        <p>
            My work in theoretical physics garnered attention, and I found myself immersed in the 
            burgeoning field of quantum mechanics. Nobel Prize 
            laureates were among my peers and mentors. This period was a formative time in my life, 
            shaping my scientific pursuits.
        </p>
        <h2>The Manhattan Project</h2>
        <p>
            The year 1942 marked a turning point when I was appointed as the scientific director of the 
            <em>Manhattan Project</em>. The goal was daunting: to develop an atomic bomb during the 
            height of World War II. Our work was centered in a secret laboratory in Los Alamos, New Mexico.
        </p>
        <p>
            The moral and ethical implications of our work weighed heavily on my conscience. 
            The success of the project, while a remarkable scientific feat, presented the world with 
            a formidable and sobering power. In 1945, the atomic bombs were dropped on Hiroshima 
            and Nagasaki, bringing an end to the war but at an immense human cost.
        </p>
        <h2>Later Years and Reflections</h2>
        <p>
            In the post-war years, I found myself at a crossroads, advocating for international control 
            of atomic energy and striving to promote peaceful uses of nuclear technology. 
            My political affiliations and stance on nuclear disarmament, however, led to a 
            controversial and public security hearing 
            in 1954, dramatically altering the course of my career.
        </p>
        <p>
            As I reflect on my journey, I am struck by the profound ways in which the pursuit of knowledge 
            can intersect with the complexities of ethics, politics, and human destiny. 
            The words from the Bhagavad Gita
            resonate deeply with me: 'Now I am become Death, the destroyer of worlds.' 
            These words, uttered at the Trinity test site, encapsulate the paradox of scientific 
            advancement and its potential consequences.
        </p>
        <p>
            <em>- J. Robert Oppenheimer</em>
        </p>
", null, null);

INSERT INTO page
VALUES
(1, "alejandrocqvd", "
        <p>
            <strong>Early Life and Education</strong><br></br>
            I was born in 1904 in New York City. My fascination with science began at a young age, 
            influenced by a vibrant, intellectual environment at home. I pursued physics with a passion 
            that eventually took me to Harvard and then to Cambridge and Göttingen for further studies.
        </p>
        <p>
            My work in theoretical physics garnered attention, and I found myself immersed in the 
            burgeoning field of quantum mechanics. Nobel Prize 
            laureates were among my peers and mentors. This period was a formative time in my life, 
            shaping my scientific pursuits.
        </p>
        <h2>The Manhattan Project</h2>
        <p>
            The year 1942 marked a turning point when I was appointed as the scientific director of the 
            <em>Manhattan Project</em>. The goal was daunting: to develop an atomic bomb during the 
            height of World War II. Our work was centered in a secret laboratory in Los Alamos, New Mexico.
        </p>
        <p>
            The moral and ethical implications of our work weighed heavily on my conscience. 
            The success of the project, while a remarkable scientific feat, presented the world with 
            a formidable and sobering power. In 1945, the atomic bombs were dropped on Hiroshima 
            and Nagasaki, bringing an end to the war but at an immense human cost.
        </p>
        <h2>Later Years and Reflections</h2>
        <p>
            In the post-war years, I found myself at a crossroads, advocating for international control 
            of atomic energy and striving to promote peaceful uses of nuclear technology. 
            My political affiliations and stance on nuclear disarmament, however, led to a 
            controversial and public security hearing 
            in 1954, dramatically altering the course of my career.
        </p>
        <p>
            As I reflect on my journey, I am struck by the profound ways in which the pursuit of knowledge 
            can intersect with the complexities of ethics, politics, and human destiny. 
            The words from the Bhagavad Gita
            resonate deeply with me: 'Now I am become Death, the destroyer of worlds.' 
            These words, uttered at the Trinity test site, encapsulate the paradox of scientific 
            advancement and its potential consequences.
        </p>
        <p>
            <em>- J. Robert Oppenheimer</em>
        </p>
");