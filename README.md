# It's a Node.js REST API server. 

### Prerequsite to run the server
  You must have the node.js and npm installed in your computer

### To run the server in your local device follow the following steps : 
  -  Take the clone of this repository
  -  create a .env file in the root folder
  -  Add DB_URI, PORT, JWT_SECRET_KEY, BCRYPT_SALT_ROUNDS with their values in the file (I will drop the contents of .env file in the bottom for testing purpose)
  -  run the command npm install
  -  After all the libraries are installed, run node index.js

### Testing .env file content
- DB_URI=mongodb+srv://prateekgoyal79:wVNOfVcw8o3Wv0eW@cluster0.cgvoc3j.mongodb.net/?retryWrites=true&w=majority
- PORT=8000
- JWT_SECRET_KEY=THIS_IS_MY_SECRET_KEY_AND_IT_SHOULD_NOT_BE_LEAKED
- BCRYPT_SALT_ROUNDS=10
