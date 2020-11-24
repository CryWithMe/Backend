
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
    type TEXT,
    date TIMESTAMP
);

CREATE TABLE Response(
    responder VARCHAR(36),
    eventID VARCHAR(36),
    responseID VARCHAR(36),
    type TEXT,
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

CREATE TABLE Triggers(
    id VARCHAR(36),
    condition TEXT,
    active BOOLEAN,
    lastUpdateDate TIMESTAMP
);

CREATE TABLE Comforts(
    id VARCHAR(36),
    condition TEXT,
    active BOOLEAN,
    lastUpdateDate TIMESTAMP
) 