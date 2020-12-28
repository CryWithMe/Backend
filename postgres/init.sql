
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

---Verify Login---
-- Takes a username and returns the salt and hash of the user ---
CREATE function verifyLogin (
   input VARCHAR(20)
) 
    returns table (
        salt VARCHAR(32),
        hash VARCHAR(64),
        id VARCHAR(36),
        active BOOLEAN
    )
    language plpgsql
as $$
begin
    return query
        SELECT 
            login.salt, 
            login.hash, 
            account.id, 
            account.active 
        FROM 
            account 
        JOIN 
            login 
        ON
            account.id = login.accountid 
        WHERE 
            account.username = input 
        ORDER BY 
            login.lastupdatedate 
        DESC LIMIT 1;
end; $$;

--Change Password--
CREATE function changePassword(
    newAccountId VARCHAR(36),
    newSalt VARCHAR(32),
    newHash VARCHAR(64)
) returns 
    VOID
language plpgsql
as $$
    BEGIN
        INSERT INTO LOGIN(accountId, salt, hash, lastUpdateDate) VALUES(newAccountId,newSalt,newHash,current_timestamp);
    END;
$$;


---Create Account---
---Takes a id,username, salt, hash, email, fname, and lname
CREATE function createAccount(
    newAccountId VARCHAR(36),
    newUsername VARCHAR(20),
    newFName VARCHAR(30),
    newLName VARCHAR(30),
    newEmail VARCHAR(320),
    newSalt VARCHAR(32),
    newHash VARCHAR(32)
) returns 
    BOOLEAN
language 
    plpgsql
as $$
    BEGIN 
        IF NOT EXISTS
            ---Seeing if username exists---
            (SELECT 
                id 
            FROM 
                account
            WHERE 
                username=newUsername
            ) 
        THEN
            INSERT INTO ACCOUNT
                (id, 
                username,
                lastUpdateDate,
                fname,
                lname,
                email,
                active) 
            VALUES
                (newAccountId,
                newUsername,
                current_timestamp,
                newFName,
                newLName,
                newEmail,
                'true');
            INSERT INTO LOGIN(
                accountid,
                salt,
                hash,
                lastUpdateDate
            ) VALUES(
                newAccountId,
                newSalt,
                newHash,
                current_timestamp
            );
            RETURN 'true';
        ELSE
            RETURN 'false';
        end if;
    END
$$;

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