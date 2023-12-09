CREATE SCHEMA mi_historia;

USE mi_historia;

CREATE TABLE user
(
    user_id             INT             NOT NULL            AUTO_INCREMENT,
    first_name          VARCHAR(70),
    middle_name         VARCHAR(70),
    last_name           VARCHAR(70),
    dob                 DATE,
    email               VARCHAR(255),
    password            VARCHAR(255),
    image               VARCHAR(255),
    private             BOOLEAN         DEFAULT FALSE,
    PRIMARY KEY (user_id)
);

CREATE TABLE post 
(
    post_id             INT             NOT NULL            AUTO_INCREMENT,
    user_id             INT             NOT NULL,
    text                MEDIUMTEXT      NOT NULL,
    timestamp           DATETIME        NOT NULL,
    PRIMARY KEY (post_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
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
    user_id             INT             NOT NULL,
    post_id             INT             NOT NULL,
    text                TEXT            NOT NULL,
    timestamp           DATETIME        NOT NULL,
    type                VARCHAR(50)     NOT NULL            DEFAULT 'text',
    PRIMARY KEY (comment_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (post_id) REFERENCES Post(post_id)
);

CREATE TABLE likes_post
(
    user_id             INT             NOT NULL,
    post_id             INT             NOT NULL,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (post_id) REFERENCES Post(post_id)
);

CREATE TABLE saves
(
    user_id             INT             NOT NULL,
    post_id             INT             NOT NULL,
    timestamp           DATETIME        NOT NULL,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (post_id) REFERENCES Post(post_id)
);

CREATE TABLE likes_comment
(
    user_id             INT             NOT NULL,
    comment_id          INT             NOT NULL,
    PRIMARY KEY (user_id, comment_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (comment_id) REFERENCES Comment(comment_id)
);
