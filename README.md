# DSMongoDBApi


## Why.

-    This is one of my firstapi/microservice in Typescript. 
-    I have written code for many years, and, although one day I was good at writing, now, over the years, I am good at detecting needs and proposing solutions to common problems, in computer science or in life itself.
-    In this set of apis, I have not paid too much attention to the details. There are many and very good professionals who will, surely, much better than me.
-    My intention, always has been, is to create a prototype with a simple idea that allows others to develop it. Something similar to a proof of concept.
-    This is the first of a series of projects that I will put in gitgub at everyone's disposal:

     - Mongo's api (the first one)
     - Translations api
     - Access to files api
     - SqlServer api
     - MySql API

And finally, in this first phase, Charly's Api.
Throughout these months, I will go up and complete some of them.

Some of this code are experimental. I enjoy to learn new techniques and concepts for me trying to understand 
what is done in each of the phases so I can explain it later with an example. This is the case of this api.

I know, I know. Comments are missing lack of documentation, the api is not complete ... 
This is deliberate because I do not intend to make a finished commercial product. This is a template that serves as a base 
and learning to those who, like me, want to start working with nodejs / typescript projects.

## Install

### In command prompt

- Clone this project
- Run npm install
- Compile Typescript
- Run node app.js

### In visual studio 2019

- Clone this project
- To run and debug in visual studio environments, remove "outDir" line of "compilerOptions" element in tsconfig.json file.
- Type F5 or start debugging


### Webpack

- Add "outDir" to tsconfig.json at "compilerOptions" element.   
   ```javascript
    "outDir": "./dist",
   ```
- Run webpack in the dist folder command prompt. This make a /dist folder with DsExample.js file.
- At command prompt: webpack --config=webpack.config.js

### Docker container.

- There are a docker file in the root folder. Run docker build to make a docker image. 
- Build docker image: docker build -t dsmongodbapi:latest .
- Create container either portainer, kitematic or another docker tool
- Run container

## Uninstall

- Remove solution.
- Remode docker container and images.

## Usage

- Run swagger from this api
  - localhost:51234
  
  ![Swagger Screen](https://github.com/jodurpar/DSMongoDBApi/blob/master/BrowserSwagger.png)

- None endpoint are set. Before use it, set the databases conection with the api calls localhost:51234/connection or /connections with 
   #### Single database
    ```javascript
    {"test": "url": "mongodb://localhost:27017", "type": "MongoDb" , "user" : "your user", "password": "your password", "encrypted" : false}
   ```
    or
   #### Multiple databases
   ```javascript
    [
    {"test": "url": "mongodb://localhost:27017", "type": "MongoDb" , "user" : "your user", "password": "your password", "encrypted" : false}
    {"test1": "url": "mongodb://localhost:27017", "type": "MongoDb" , "user" : "your user", "password": "your password", "encrypted" : false}    
    ]
   ```
>     
    > "test" is the name of your personal connection, 
    > url is de database connection string and 
    > type must be "MongoDB"
    > user (not implemented now) reserved for authenticated adatabase access.
    > password (not implemented now) reserved for authenticated adatabase access.
    > encrypted (not implemented now) reserved for authenticated adatabase access. If user and password are encrypted set to true.

- Configure mongoDatabases.json at root to add your databases
  - Remove existing Json data and add your own data
   ```javascript
    "test": { "url": "mongodb://localhost:27017", "type": "MongoDb" , "user" : "your user", "password": "your password", "encrypted" : false}
   ```
>     
    > "test" is the name of your personal connection, 
    > url is de database connection string and 
    > type must be "MongoDB"
    > user (not implemented now) reserved for authenticated adatabase access.
    > password (not implemented now) reserved for authenticated adatabase access.
    > encrypted (not implemented now) reserved for authenticated adatabase access. If user and password are encrypted set to true.

- Run "node app.js" in to cloned directory once typescript are compiled.
  - In adiction, you can overload the default api values set in apiData.json by enter this args in command line
    - --a, --apidata : alternate apiData.json file
    - --h, --host : alternate host name
    - --p, --port : alternate port number
    - --d, --description: alternate api description
    - --n, --name: alternate api name
    - --l, --loglevel: set logs level : one of these "trace, debug, info, warn, error, fatal"
    - --g, --logtype: set logs type: "c" for console, "e" for elastic
    - --s, --statistics: true or false

- The api was configurate to run in localhost:51234, but can be changed editing  the file /src/api/common/apiData.ts

- If you want to build another break version (example another 2.0.0 version) simple copy and paste V1 to V2 folder and change all the references from V1 to V2 inside the files in the V2 folder.
  > Also you need to add all api200 references where api100 references are used. This version only take care of the first number, because only mayor released are used.  
  > 


## Test Examples

* [TestExamples](https://github.com/jodurpar/DSMongoDBApi/blob/master/TestMe.md)

### Author

**José Durán Pareja**

* [github/jodurpar](https://github.com/jodurpar)

### License

Copyright © 2020, 2020 [José Durán Pareja](https://github.com/jodurpar).
Released under the [MIT License](./mitLicense.md).



