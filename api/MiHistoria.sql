CREATE SCHEMA MiHistoria;

USE MiHistoria;

CREATE TABLE User
(
    UserID              INT             NOT NULL            AUTO_INCREMENT,
    FirstName           VARCHAR(70),
    MiddleName          VARCHAR(70),
    LastName            VARCHAR(70),
    DOB                 DATE,
    Email               VARCHAR(255),
    Password            VARCHAR(255),
    Image               VARCHAR(255),
    Private             BOOLEAN         DEFAULT FALSE,
    PRIMARY KEY (UserID)
);

CREATE TABLE Post 
(
    PostID              INT             NOT NULL            AUTO_INCREMENT,
    UserID              INT             NOT NULL,
    Text                MEDIUMTEXT      NOT NULL,
    Timestamp           DATETIME        NOT NULL,
    PRIMARY KEY (PostID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE PostMedia
(
    PostID              INT             NOT NULL,
    Media               VARCHAR(255)    NOT NULL,
    PRIMARY KEY (PostID, Media),
    FOREIGN KEY (PostID) REFERENCES Post(PostID)
);

CREATE TABLE Comment
(
    CommentID           INT             NOT NULL            AUTO_INCREMENT,
    UserID              INT             NOT NULL,
    PostID              INT             NOT NULL,
    Text                TEXT            NOT NULL,
    Timestamp           DATETIME        NOT NULL,
    Type                VARCHAR(50)     NOT NULL            DEFAULT 'text',
    PRIMARY KEY (CommentID, UserID, PostID),
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (PostID) REFERENCES Post(PostID)
);

CREATE TABLE LikesPost
(
    UserID              INT             NOT NULL,
    PostID              INT             NOT NULL,
    PRIMARY KEY (UserID, PostID),
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (PostID) REFERENCES Post(PostID)
);

CREATE TABLE Saves
(
    UserID              INT             NOT NULL,
    PostID              INT             NOT NULL,
    Timestamp           DATETIME        NOT NULL,
    PRIMARY KEY (UserID, PostID),
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (PostID) REFERENCES Post(PostID)
);

CREATE TABLE LikesComment
(
    UserID              INT             NOT NULL,
    CommentID           INT             NOT NULL,
    PRIMARY KEY (UserID, CommentID),
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (CommentID) REFERENCES Comment(CommentID)
);
