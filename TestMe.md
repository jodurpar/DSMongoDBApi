# DSMongoDBApi


## Test Examples

- To test it, simple run "node app.js". When done, you recieved this (or similar) log message 
   ```javascript
   {"name":"standard","extra":"dsMongoDBApi","hostname":"DESKTOP-Q800056","pid":11552,"level":30,"msg":"dsMongoDBApi listening at http://[::]:51234","time":"2020-09-01T12:26:21.321Z","v":0}
   ```

## Run in local
 - Enter in command prompt.
 - Navigate to api src folder and then run "node app"

## Run in docker
 - Enter in command prompt.
 - Navigate to api home folder / src and then run webpack
 - Navigate  to api home folder / dist and then run "docker build -t dsmongodb:dsmongodb . --no-cache" to build api image
 - Create and configure mongo oficial image.
 - Run "docker run -d --name dsmongodb -p 51234:51234 dsmongodb:dsmongodb" or use kitematic to run mongo image and dsmongodb image created before.

### Testing in a browser
    
- Go to your browser and navigate to http://localhost:51234/Swagger . If all are ok, you will see this screen:
 
![Swagger Screen](https://github.com/jodurpar/DSMongoDBApi/blob/master/BrowserSwagger.png)

- You don't need MongoDb to test this api. Just use TestMessages or TestMessagesAsync. Enter one message and you got your message back in response

![TestMessages Screen](https://github.com/jodurpar/DSMongoDBApi/blob/master/TestMessage.PNG)

### Testing in Postman

- __Run Postman__ 
- __HealthCheck__
 ```javascript
    localhost:51234/Health
 ```
  - In the response body can recieve this JSON object
 ```javascript
    {
    "responseCode": 200,
    "status": "Ok",
    "data": {
        "api": {
            "apiName": "dsMongoDBApi",
            "apiVersion": "0.4.2",
            "apiSupportedVersions": [
                "1.0.0"
            ], 
            "apiHost": "localhost",
            "apiPort": "51234",
            "apiDescription": "Demonstrating how to describe a RESTful API with Restify, MongoDb, Swagger and Bunyan logs with Elastic"
        },
        "databases": [
            {
                "connectionName": "Translations",
                "databaseName": "Translations",
                "url": "mongodb://localhost:27017",
                "status": "Ok"
            }
        ]
    }
}
 ```
- __For TestMessage, select GET verb and enter__
   ```javascript
   localhost:51234/TestMessages/This is one message
   ```
   - In the response body can recieve this JSON object
   ```javascript
    {
    "responseCode:": 200,
    "status": "Ok",
    "data": "TestMessages: 1.0.0 Recieved: This is one message"
    }
   ```
   - If there are any error, you may recieve the HTTP error. The "1.0.0" literal is de last versión of this api.


- __For Documents CRUD operations__
    - _Get documents_. For get documents you need provide database name, collection name and filter in the request
      - database is the database id. This id will match with the id of your entry in the mongoDatabases.json file.
      - collection is the name collection when you looking for.
      - filter is a JSON object contains the mongodb filter structure for search data
      - selectedFields is a JSON object contains the mongodb object to filter the fields returned (vg: { "fieldname": 1}, causes only fielName to be returned, put { "fieldname": 0}, to hide this field in the response)
        - Example: Select GET and enter
          ```javascript
          localhost:51234/Documents?database=test&collection=testCollection&filter={"name":"My name" }&selectedFields= {"name":1,"address":1}
          ```
          You can recieve this json array:
            ```javascript
                [
                    {
                    "_id": "5b8a383fad881f6df0290fb8",
                    "name": "My name",
                    "address": "street X"
                    },
                    {
                    "_id": "5b8a380fad881f6df0290fb7",
                    "name": "My name",
                    "address": "street Y"
                    }
                ]
            ```
            All the documents with name equals to "My name" are returned in one array of JSON documents.
    _ _Put documents_. For add documents to the collection you need provide database name and collection name in the request
      - database is the database id. This id will match with the id of your entry in the mongoDatabases.json file.
      - collection is the name collection when you want add the document.
      - Example: Select PUT verb and enter
          ```javascript
          localhost:51234/Documents?database=test&collection=testCollection
          ```
      - In the _body_ of the request you need enter the JSON objet to add. For example:
         ```javascript
            {
            "name": "My best friend name",
            "address": "Is my neighbour"
            }
        ```
        You can recieve this JSON data:
           ```javascript
       
                {
                "name": "My best friend name",
                "address": "Is my neighbour",
                "_id": "5b8ac2b9d4189f7bd44375e2"
                }
        }
            ```
    - _Patch documents_. For update one or more documents you need provide database name, collection name, the filter and options value in the request
      - database is the database id. This id will match with the id of your entry in the mongoDatabases.json file.
      - collection is the name collection when the update document are.
      - filter is a JSON object contains the mongodb filter structure for search data
      - options is optional.  If set you can enter if all or only the first document matches with the filter is updated. Is set to false by default. The value may be { "multi" : "true"}
        - Example: Select PATCH verb and enter
         ```javascript
         localhost:51234/Documents?database=test&collection=testCollection&filter={"name":"My best friend name" }
         ```
      - In the _body_ of the request you need enter the JSON objet to update. For example:
         ```javascript
        {
        "address": "Another address"
        }
        ```
        You can recieve this JSON data:
        ```javascript
         {
               "_id": "5b8ac2b9d4189f7bd44375e2",
               "name": "My best friend name",
               "address": "Is my neighbour"
        }
        ```
        If now you get the document can see this JSON object:
        ```javascript
        { 
            "_id" : ObjectId("5b8ac2b9d4189f7bd44375e2"), 
            "name" : "My best friend name", 
            "address" : "Another address"
        }
        ```
    - _Delete documents_ For delete one document you need provide database name, collection name and the filter in the request
      - database is the database id. This id will match with the id of your entry in the mongoDatabases.json file.
      - collection is the name collection when the document are.
      - filter is a JSON object contains the mongodb filter structure for search data
        - Example: Select DELETE verb and enter
          ```javascript
            localhost:51234/Documents?database=test&collection=testCollection&filter={"name":"My best friend name"}
          ```
          You can recieve this JSON data
          ```javascript
            {
            "responseCode:": 200,
            "status": "Ok",
            "data": {
                "ok": 1,
                "n": 1
                }
            }
          ```
          If get now the document you recieve a HTTP 404 error.

    - ___Special feature___: Drop collections. Be careful, there are not silver bullit
    - You need provide database name, collection name in the request
    - Example: Setlet GET verb and enter
       ```javascript
        http://localhost:51234/Collections/Drop?database=test&collection=testCollection
       ```
        You can recieve this JSON data:
        ```javascript
            {
            "responseCode:": 200,
            "status": "ok"
            }
        ```
        Now your collection and data are gone definitely.

## Use the api from your code 

    You need an http client to access to the api.

### Angular Typescript code
#### Get data, same aplies to all others CRUD operations, you can see the swagger example to reply
 
   ```javascript
        import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';

        export class HttpclientService {

        constructor(public http: HttpClient) {
            }

        public getData<T>(urlParams: string, myParams : HttpParams = undefined) : Promise<T> {

        let url = 'localhost:51234' + urlParams;

        let promise = new Promise<T>((resolve, reject) => {

        try {

            let myheaders = new HttpHeaders();
            myheaders.set("client-authorization", "Myapp");
            myheaders = myheaders.append("client-authentication", "app");
            myheaders = myheaders.append("accept-version", "1.0.0");

            this.http.get(url, { headers: myheaders , params : myParams})
                .toPromise()
                .then(response => {
                resolve(response as T);
            } )
        } catch (e) {
        reject([]);
        }
        });
        return promise;
       }
    }
   ```

### C# Code (same to all .NET)


### Author

**José Durán Pareja**

* [github/jodurpar](https://github.com/jodurpar)

### License

Copyright © 2020, 2020 [José Durán Pareja](https://github.com/jodurpar).
Released under the [MIT License](./mitLicense.md).

