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

FriendLsit Shit

post /friendRequest

    body:

        accountId

        username

get /friendRequests/:accountId

    returns
        
        username, fname, lname

post /acceptFriendRequest

    body

        accountId

        username

    returns

        status

post /denyFriendRequest

    body

        accountId

        username

    returns

        status

get friendList/:accountId

    returns

        array

            fname

            lname

            username

post /deleteFriend

    body

        accountId

        username
    
    returns

        status

post /condition

    body

        accountId

        condition

    returns

        status

get /condition/:username

    return

        return conditions


post /comfort

    body

        accountId

        comfort
    
    returns 

        200

get /comfort/:username

    return

        comforts
    

post /token

    body

        accountId

        token
    returns

        status

post /event

    body

        accountId

        type
    
    return

        status

post /eventResponse

    body

        accountId

        username

        type
    
    return

        status

get /eventList/:id

    return
        
        eventList