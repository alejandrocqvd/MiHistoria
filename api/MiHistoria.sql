CREATE SCHEMA mi_historia;

USE mi_historia;

CREATE TABLE user
(
    username             INT             NOT NULL            AUTO_INCREMENT,
    first_name          VARCHAR(70),
    middle_name         VARCHAR(70),
    last_name           VARCHAR(70),
    dob                 DATE,
    email               VARCHAR(255),
    password            VARCHAR(255),
    image               VARCHAR(255),
    private             BOOLEAN         DEFAULT FALSE,
    PRIMARY KEY (username)
);

CREATE TABLE post 
(
    post_id             INT             NOT NULL            AUTO_INCREMENT,
    username             INT             NOT NULL,
    text                MEDIUMTEXT      NOT NULL,
    timestamp           DATETIME        NOT NULL,
    PRIMARY KEY (post_id),
    FOREIGN KEY (username) REFERENCES User(username)
);

CREATE TABLE post_media
(
    post_id             INT             NOT NULL,
    media               VARCHAR(255)    NOT NULL,
    PRIMARY KEY (post_id, media),
    FOREIGN KEY (post_id) REFERENCES Post(post_id)
);

CREATE TABLE comment
(
    comment_id          INT             NOT NULL            AUTO_INCREMENT,
    username             INT             NOT NULL,
    post_id             INT             NOT NULL,
    text                TEXT            NOT NULL,
    timestamp           DATETIME        NOT NULL,
    type                VARCHAR(50)     NOT NULL            DEFAULT 'text',
    PRIMARY KEY (comment_id),
    FOREIGN KEY (username) REFERENCES User(username),
    FOREIGN KEY (post_id) REFERENCES Post(post_id)
);

CREATE TABLE likes_post
(
    username             INT             NOT NULL,
    post_id             INT             NOT NULL,
    PRIMARY KEY (username, post_id),
    FOREIGN KEY (username) REFERENCES User(username),
    FOREIGN KEY (post_id) REFERENCES Post(post_id)
);

CREATE TABLE saves
(
    username             INT             NOT NULL,
    post_id             INT             NOT NULL,
    timestamp           DATETIME        NOT NULL,
    PRIMARY KEY (username, post_id),
    FOREIGN KEY (username) REFERENCES User(username),
    FOREIGN KEY (post_id) REFERENCES Post(post_id)
);

CREATE TABLE likes_comment
(
    username             INT             NOT NULL,
    comment_id          INT             NOT NULL,
    PRIMARY KEY (username, comment_id),
    FOREIGN KEY (username) REFERENCES User(username),
    FOREIGN KEY (comment_id) REFERENCES Comment(comment_id)
);
