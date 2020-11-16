
CREATE TABLE Account(
    id VARCHAR(36),
    username VARCHAR(20),
    fname varchar(30),
    lname varchar(30),
    email varchar(320),
    lastUpdateDate TIMESTAMP,
    active BOOLEAN
);

CREATE TABLE Login(
    accountId varchar(36),
    salt varchar(32),
    hash varchar(64),
    lastUpdateDate TIMESTAMP
);

CREATE TABLE FriendList(
    sender VARCHAR(36),
    recipient VARCHAR(36),
    state varchar(20),
    lastUpdateDate TIMESTAMP
);

CREATE TABLE Event(
    sender VARCHAR(36),
    eventID VARCHAR(36),
    type VARCHAR(20),
    date TIMESTAMP
);

CREATE TABLE Response(
    responder VARCHAR(36),
    eventID VARCHAR(36),
    responseID VARCHAR(36),
    type VARCHAR(36),
    date TIMESTAMP
);

CREATE TABLE Bio(
    id VARCHAR(36),
    text TEXT,
    lastUpdateDate TIMESTAMP
);

CREATE TABLE Condition(
    id VARCHAR(36),
    condition TEXT,
    active BOOLEAN,
    lastUpdateDate TIMESTAMP
);

CREATE TABLE Push(
    id VARCHAR(36),
    pushtoken VARCHAR(36),
    active BOOLEAN,
    lastUpdateDate date
);

INSERT INTO Account (
    id ,
    username ,
    fname ,
    lname ,
    email ,
    lastUpdateDate ,
    active )
VALUES (
'1',
'gwinnning',
'Abby',
'Gwin',
'agwin@mail.com',
'0',
'1',
),
(
'2',
'bevans123',
'Bailey',
'Evans',
'bevans@mail.com',
'0',
'1',
),
(
'3',
'chall',
'Carol',
'Hall',
'chall@mail.com',
'0',
'1',
),
(
'4',
'plantman',
'Alexander',
'Plant',
'aplant@mail.com',
'0',
'1',
),
(
'5',
'steve',
'Stephen',
'Shoemaker',
'sshoe@mail.com',
'0',
'1',
),
(
'6',
'sonobambino',
'Dom',
'Lorenzi',
'dlorenzi@mail.com',
'0',
'1',
),
(
'7',
'sadboihrs',
'Austin',
'Miller',
'amiller@mail.com',
'0',
'1',
);