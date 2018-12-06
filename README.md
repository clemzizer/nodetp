# Project Node
## Clément VOISIN
### Introduction
> We have implemeted a web API that allows us to CRUD a user and CRUD his and only his metrics
>
> There is a functional front interface that allows you to use these APIs

### Run instructions 
>To start using the program first launch a terminal/shell in the nodetp folder then run:
>
>> #### npm install 
>
> You may then run: 
>
>> #### npm test 
>
>>
> Go to the root of the website then create a "db" folder
>
> You can now run the following command and start using the website and APIs 
>> #### npm start
> 
#### Populate
> To get started quickly go to localhost:8080/populate and click on create user 1 and create user 2
>
> You may now go back to localhost:8080 to login with the first user:
>> ##### Username = user
>> ##### Password = pwd
> Or the second user:
>> ##### Username = user2
>> ##### Password = pwd
>
### Available APIs
>
#### Signup 
>
>> ##### PUT localhost:8080/signup
>
>> ##### {"username":"yourusername", "password":"yourpassword", "email":"youremail"}
>
#### Login
>
>> ##### PUT localhost:8080/login
>
>> ##### {"username":"yourusername", "password":"yourpassword"}
>
#### Logout
>
>> ##### GET localhost:8080/logout
>
#### Get all user metrics
> Returns all of the logged in user's metrics
>
>> ##### GET localhost:8080/metrics/all
>
#### Get a specific metric
> Returns the logged in user's metrics whith the corresponding id if they exist
>
>> ##### GET localhost:8080/metrics/:id
>
#### Add a specific metric
> 
> !!!! Be carefull you have to add each metric one a time !!!
>
>> ##### PUT localhost:8080/metrics/:id
>
>> ##### {"timestamp":"yourtimestamp", "value":"yourvalue"}
>
#### Update a specific metric
> Same as add but use the same id and timestamp !!!
>
> !!!! Be carefull you have to update each metric one a time !!!
>
#### Delete a specific metric
>
>> ##### DELETE localhost:8080/metrics/:id
>
#### Get user credentials
>You may check a user's credentials using the following get request, this would not be permitted in a realife senario but for testing purposes this API is left OPEN
>
>> ##### GET localhost:8080/user/:username
>
#### Delete a user 
>
>> ##### DELETE localhost:8080/user/:username
>
