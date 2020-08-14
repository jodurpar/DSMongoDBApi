// 
// If you prefer, can put all yours jsdocs

// #region sync
/**
 * @swagger
 * /TestMessages/{message}:
 *   get:
 *     summary: Test api. Send and recieve message.
 *     description: Returns the message enter by parameter.
 *     parameters:
 *      - name: message
 *        description : text of return message.
 *        in : path
 *        required : true       
 *        type: string
 *     produces:
 *       - text/plain
 *     responses:
 *       200:
 *         description: Message send.
 *       500: 
 *          description: Internal server error.
 */

/**
 * @swagger
 * /Health:
 *   get:
 *     summary: Health page.
 *     description: Returns health data, check all connection alive.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Json results.
 *       500: 
 *          description: Internal server error.
 */

/**
 * @swagger
 * /Connection:
 *   put:
 *     summary: Add connection on the fly.
 *     description: Add on the fly connection.
 *     consumes:
 *      - application/json
 *     parameters:
 *      - name: connection
 *        description : connection json data.
 *        in : query
 *        required : true
 *        type: string
 *        example: { connectionName : 'NmjGlobal2', databaseName : 'NmjGlobal2', url: 'mongodb://127.0.0.1:27017', type: 'MongoDb',  user: '', password: '', encrypted :  false }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Json results.
 *       500: 
 *          description: Internal server error.
 */
 
 /**
 * @swagger
 * /Connections:
 *   put:
 *     summary: Set all connections on the fly.
 *     description: Set on the fly connection.
 *     consumes:
 *      - application/json
 *     parameters:
 *      - name: connections
 *        description : connections json array data.
 *        in : query
 *        required : true
 *        type: string
 *        example: [{ connectionName : 'NmjGlobal2', databaseName : 'NmjGlobal2', url: 'mongodb://127.0.0.1:27017', type: 'MongoDb',  user: '', password: '', encrypted :  false }]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Json results.
 *       500: 
 *          description: Internal server error.
 */

/**
 * @swagger
 * /Documents:
 *   get:
 *     summary: Get documents from databases.
 *     description: Return data list.
 *     parameters:
 *      - name: database
 *        description : Collection database name.
 *        in : query
 *        required : true  
 *        schema:
 *          type: string
 *        example: test
 *      - name: collection
 *        description : Collection name.
 *        in : query
 *        required : true
 *        type: string
 *      - name: filter
 *        description : Query filter.
 *        in : query
 *        required : true
 *        type: string
 *      - name: accept-version
 *        description : The api version number.
 *        in : headers
 *        required : false
 *        type: string
 *        default: 1.0.0
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Data returned ok.
 *       500:
 *          description: Internal server error.
 */

/**
 * @swagger
 * /Documents/{database}/{collection}:
 *   put:
 *     summary: Add documents from databases.
 *     description: Add documents to database
 *     consumes:
 *      - application/json
 *     parameters:
 *      - name: database
 *        description : Collection database name.
 *        in : path
 *        required : true  
 *        type: string
 *        example: test
 *      - name: collection
 *        description : Collection name.
 *        in : path
 *        required : true
 *        type: string
 *      - name: accept-version
 *        description : The api version number.
 *        in : headers
 *        required : false
 *        type: string
 *        default: 1.0.0
 *      - name : Body
 *        in : body
 *        description: Data 
 *        required: true
 *        content:
 *           application/json:
 *             schema:        
 *               AnyValue:{}
 *     responses:
 *       200:
 *         description: response object.
 *       content:
 *          application/json:
 *             schema:
 *                AnyValue:
 *                   nullable: true
 *                   description : xxxx
 *       500:
 *          description: Internal server error.
 *           
 * 
 *   patch:
 *     summary: Update documents from databases.
 *     description: Update documents to database
 *     consumes:
 *      - application/json
 *     parameters:
 *      - name: database
 *        description : Collection database name.
 *        in : path
 *        required : true
 *        type: string
 *        example: test
 *      - name: collection
 *        description : Collection name.
 *        in : path
 *        required : true
 *        type: string
 *      - name: filter
 *        description : Query filter.
 *        in : query
 *        required : true
 *        content:
 *           application/json:
 *             schema:
 *               AnyValue:{}
 *      - name: accept-version
 *        description : The api version number.
 *        in : headers
 *        required : false
 *        type: string
 *        default: 1.0.0
 *      - name : Body
 *        in : body
 *        description: Data
 *        required: true
 *        content:
 *           application/json:
 *             schema:
 *               AnyValue:{}
 *     responses:
 *       200:
 *         description: response object.
 *       content:
 *          application/json:
 *             schema:
 *                AnyValue:
 *                   nullable: true
 *                   description : xxxx
 *       500:
 *          description: Internal server error.
 *            
 *    
 *   delete:
 *     summary: Delete documents from databases.
 *     description: Delete documents to database
 *     consumes:
 *      - application/json
 *     parameters:
 *      - name: database
 *        description : Collection database name.
 *        in : path
 *        required : true
 *        type: string
 *        example: test
 *      - name: collection
 *        description : Collection name.
 *        in : path
 *        required : true
 *        type: string
 *      - name: filter
 *        description : Query filter.
 *        in : query
 *        required : true
 *        content:
 *           application/json:
 *             schema:
 *               AnyValue:{}
 *      - name: accept-version
 *        description : The api version number.
 *        in : headers
 *        required : false
 *        type: string
 *        default: 1.0.0
 *     responses:
 *       200:
 *         description: response object.
 *       content:
 *          application/json:
 *             schema:
 *                AnyValue:
 *                   nullable: true
 *                   description : xxxx
 *       500:
 *          description: Internal server error.
 *
 */


// #endregion

// #region Async

 /**
 * @swagger
 * /TestMessagesAsync/{message}:
 *   get:
 *     summary: Test api. Send and recieve message. Async version.
 *     description: Returns the message enter by parameter.
 *     parameters:
 *      - name: message
 *        description : text of return message.
 *        in : path
 *        required : true       
 *        type: string
 *     produces:
 *       - text/plain
 *     responses:
 *       200:
 *         description: Message send.
 *       500:
 *          description: Internal server.
 */

/**
 * @swagger
 * /DocumentsAsync:
 *   get:
 *     summary: Get documents from databases.
 *     description: Return data list.
 *     parameters:
 *      - name: database
 *        description : Collection database name.
 *        in : query
 *        required : true       
 *        type: string
 *      - name: collection
 *        description : Collection name.
 *        in : query
 *        required : true
 *        type: string
 *      - name: filter
 *        description : Query filter.
 *        in : query
 *        required : true
 *        type: string
 *     produces:
 *       - text/plain
 *     responses:
 *       200:
 *         description: Data returned ok.
 *       500:
 *          description: Internal server error.
 */

/**
 * @swagger
 * /DocumentsAsync/{database}/{collection}:
 *   put:
 *     summary: Add documents from databases.
 *     description: Add documents to database
 *     consumes:
 *      - application/json
 *     parameters:
 *      - name: database
 *        description : Collection database name.
 *        in : path
 *        required : true  
 *        type: string
 *        example: test
 *      - name: collection
 *        description : Collection name.
 *        in : path
 *        required : true
 *        type: string
 *      - name: accept-version
 *        description : The api version number.
 *        in : headers
 *        required : false
 *        type: string
 *        default: 1.0.0
 *      - name : Body
 *        in : body
 *        description: Data 
 *        required: true
 *        content:
 *           application/json:
 *             schema:        
 *               AnyValue:{}
 *     responses:
 *       200:
 *         description: response object.
 *       content:
 *          application/json:
 *             schema:
 *                AnyValue:
 *                   nullable: true
 *                   description : xxxx
 *       500:
 *          description: Internal server error.
 *           
 * 
 *   patch:
 *     summary: Update documents from databases.
 *     description: Update documents to database
 *     consumes:
 *      - application/json
 *     parameters:
 *      - name: database
 *        description : Collection database name.
 *        in : path
 *        required : true
 *        type: string
 *        example: test
 *      - name: collection
 *        description : Collection name.
 *        in : path
 *        required : true
 *        type: string
 *      - name: filter
 *        description : Query filter.
 *        in : query
 *        required : true
 *        content:
 *           application/json:
 *             schema:
 *               AnyValue:{}
 *      - name: accept-version
 *        description : The api version number.
 *        in : headers
 *        required : false
 *        type: string
 *        default: 1.0.0
 *      - name : Body
 *        in : body
 *        description: Data
 *        required: true
 *        content:
 *           application/json:
 *             schema:
 *               AnyValue:{}
 *     responses:
 *       200:
 *         description: response object.
 *       content:
 *          application/json:
 *             schema:
 *                AnyValue:
 *                   nullable: true
 *                   description : xxxx
 *       500:
 *          description: Internal server error.
 *            
 *    
 *   delete:
 *     summary: Delete documents from databases.
 *     description: Delete documents to database
 *     consumes:
 *      - application/json
 *     parameters:
 *      - name: database
 *        description : Collection database name.
 *        in : path
 *        required : true
 *        type: string
 *        example: test
 *      - name: collection
 *        description : Collection name.
 *        in : path
 *        required : true
 *        type: string
 *      - name: filter
 *        description : Query filter.
 *        in : query
 *        required : true
 *        content:
 *           application/json:
 *             schema:
 *               AnyValue:{}
 *      - name: accept-version
 *        description : The api version number.
 *        in : headers
 *        required : false
 *        type: string
 *        default: 1.0.0
 *     responses:
 *       200:
 *         description: response object.
 *       content:
 *          application/json:
 *             schema:
 *                AnyValue:
 *                   nullable: true
 *                   description : xxxx
 *       500:
 *          description: Internal server error.
 *
 */


/**
 * @swagger
 * /HealthAsync:
 *   get:
 *     summary: Health page.
 *     description: Returns health data, check all connection alive.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Json results.
 *       500: 
 *          description: Internal server error.
 */


// #endregion