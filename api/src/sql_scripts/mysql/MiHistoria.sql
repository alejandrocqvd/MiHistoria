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
    timestamp           DATETIME        DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (comment_username) REFERENCES user(username),
    FOREIGN KEY (story_username) REFERENCES story(username)
);

CREATE TABLE likes
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
    timestamp            DATETIME        DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (save_username, story_username),
    FOREIGN KEY (save_username) REFERENCES user(username),
    FOREIGN KEY (story_username) REFERENCES story(username)
);
