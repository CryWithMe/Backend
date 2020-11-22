Account Shit

post /login
    body:
        username
        password
    returns:
        id

put /changePassword
    body:
        accountId
        newPassword
    returns:
        status code

post /createAccount
    body:
        username
        password
        email
        fname
        lname
    returns:
        id

post /deleteAccount
    body:
        username
    returns:
        status code

put /updateAccount
    body:
        id
        username
        email
        fname
        lname
    returns:
        statusCode

get /accountInfo/:accountId
    returns:
        username, fname, lname, email

get /searchAccount/:username
    returns
        fname,lname
