## UF CSA Airpick
--------- 
#### A Free Airport Pickup Platform that connect volunteers and new students.

## Before You Begin
This project is based on Mean.js. Basic Angularjs(1.x), MongoDB, Node.js and Expressjs knowledge is needed to participate in maintaining this project. 


## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```
## Deploy 
If you are one of the authorized developer and want to deploy your update to the production environment on heroku, make sure the nodejs version in package.json is fixed to 6.x.x. 

## Quick Install
Once you've downloaded the boilerplate and installed all the prerequisites, you're just a few steps away from starting to develop your MEAN application.

The boilerplate comes pre-bundled with a `package.json` and `bower.json` files that contain the list of modules you need to start your application.

To install the dependencies, run this in the application folder from the command-line:

```bash
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* When the npm packages install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application
* To update these packages later on, just run `npm update`

## Running Your Application

Run your application using npm:

```bash
$ npm start
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! Your application should be running. To proceed with your development, check the other sections in this documentation.
If you encounter any problems, try the Troubleshooting section.

Explore `config/env/development.js` for development environment configuration options.

### Running in Production mode
To run your application with *production* environment configuration:

```bash
$ npm run start:prod
```

Explore `config/env/production.js` for production environment configuration options.

### Running with User Seed
To have default account(s) seeded at runtime:

In Development:
```bash
MONGO_SEED=true npm start
```
It will try to seed the users 'user' and 'admin'. If one of the user already exists, it will display an error message on the console. Just grab the passwords from the console.

In Production:
```bash
MONGO_SEED=true npm start:prod
```
This will seed the admin user one time if the user does not already exist. You have to copy the password from the console and save it.

### Running with TLS (SSL)
Application will start by default with secure configuration (SSL mode) turned on and listen on port 8443.
To run your application in a secure manner you'll need to use OpenSSL and generate a set of self-signed certificates. Unix-based users can use the following command:

```bash
$ npm run generate-ssl-certs
```

Windows users can follow instructions found [here](http://www.websense.com/support/article/kbarticle/How-to-use-OpenSSL-and-Microsoft-Certification-Authority).
After you've generated the key and certificate, place them in the *config/sslcerts* folder.

Finally, execute prod task `npm run start:prod`
* enable/disable SSL mode in production environment change the `secure` option in `config/env/production.js`

## Development and deployment With Docker

* Install [Docker](https://docs.docker.com/installation/#installation)
* Install [Compose](https://docs.docker.com/compose/install/)

* Local development and testing with compose:
```bash
$ docker-compose up
```

* Local development and testing with just Docker:
```bash
$ docker build -t mean .
$ docker run -p 27017:27017 -d --name db mongo
$ docker run -p 3000:3000 --link db:db_1 mean
$
```

* To enable live reload, forward port 35729 and mount /app and /public as volumes:
```bash
$ docker run -p 3000:3000 -p 35729:35729 -v /Users/mdl/workspace/mean-stack/mean/public:/home/mean/public -v /Users/mdl/workspace/mean-stack/mean/app:/home/mean/app --link db:db_1 mean
```

### Production deploy with Docker

* Production deployment with compose:
```bash
$ docker-compose -f docker-compose-production.yml up -d
```

* Production deployment with just Docker:
```bash
$ docker build -t mean -f Dockerfile-production .
$ docker run -p 27017:27017 -d --name db mongo
$ docker run -p 3000:3000 --link db:db_1 mean
```

## Deploying to PAAS

###  Deploying MEANJS To Heroku

By clicking the button below you can signup for Heroku and deploy a working copy of MEANJS to the cloud without having to do the steps above.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Amazon S3 configuration

To save the profile images to S3, simply set those environment variables:
UPLOADS_STORAGE: s3
S3_BUCKET: the name of the bucket where the images will be saved
S3_ACCESS_KEY_ID: Your S3 access key
S3_SECRET_ACCESS_KEY: Your S3 access key password

## Getting Started With MEAN.JS
You have your application running, but there is a lot of stuff to understand. We recommend you go over the [Official Documentation](http://meanjs.org/docs.html).
In the docs we'll try to explain both general concepts of MEAN components and give you some guidelines to help you improve your development process. We tried covering as many aspects as possible, and will keep it updated by your request. You can also help us develop and improve the documentation by checking out the *gh-pages* branch of this repository.

## Credits
Thanks for all the contributors to Mean.js!
Inspired by the great work of [Madhusudhan Srinivasa](https://github.com/madhums/)
The MEAN name was coined by [Valeri Karpov](http://blog.mongodb.org/post/49262866911/the-mean-stack-mongodb-expressjs-angularjs-and).

Airpick collaborators: Zhongkai Liu, Yinghan Ma, Yanghaoyu Chen, Shida Yang

## License
[The MIT License](LICENSE.md)
