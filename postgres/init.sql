
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
)