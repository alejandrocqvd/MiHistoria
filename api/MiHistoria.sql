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
    story_id            INT             NOT NULL            AUTO_INCREMENT,
    username            VARCHAR(255)    NOT NULL,
    title               VARCHAR(255)    NOT NULL,
    timestamp           DATETIME        NOT NULL,
    PRIMARY KEY (story_id),
    FOREIGN KEY (username) REFERENCES user(username)
);

CREATE TABLE page
(
    page_number         INT             NOT NULL            AUTO_INCREMENT,
    story_id            INT             NOT NULL,
    text                MEDIUMTEXT,
    PRIMARY KEY (page_number, story_id),
    FOREIGN KEY (story_id) REFERENCES story(story_id)
);

CREATE TABLE comment
(
    comment_id          INT             NOT NULL            AUTO_INCREMENT,
    username            VARCHAR(255)    NOT NULL,
    story_id            INT             NOT NULL,
    text                TEXT            NOT NULL,
    timestamp           DATETIME        NOT NULL,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (username) REFERENCES user(username),
    FOREIGN KEY (story_id) REFERENCES story(story_id)
);

CREATE TABLE likes_story
(
    username             VARCHAR(255)    NOT NULL,
    story_id             INT             NOT NULL,
    PRIMARY KEY (username, story_id),
    FOREIGN KEY (username) REFERENCES user(username),
    FOREIGN KEY (story_id) REFERENCES story(story_id)
);

CREATE TABLE saves
(
    username             VARCHAR(255)    NOT NULL,
    story_id             INT             NOT NULL,
    timestamp            DATETIME        NOT NULL,
    PRIMARY KEY (username, story_id),
    FOREIGN KEY (username) REFERENCES user(username),
    FOREIGN KEY (story_id) REFERENCES story(story_id)
);

CREATE TABLE likes_comment
(
    username            VARCHAR(255)    NOT NULL,
    comment_id          INT             NOT NULL,
    PRIMARY KEY (username, comment_id),
    FOREIGN KEY (username) REFERENCES User(username),
    FOREIGN KEY (comment_id) REFERENCES Comment(comment_id)
);
