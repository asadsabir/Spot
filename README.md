## Installation

This runs on Node.js. On [its website](http://www.nodejs.org/download/) you can find instructions on how to install it. You can also follow [this gist](https://gist.github.com/isaacs/579814) for a quick and easy way to install Node.js and npm.

Once installed, clone the repository and install its dependencies running:

    $ npm install

### Using your own credentials
You will need to register your app and get your own credentials from the Spotify for Developers Dashboard.

To do so, go to [your Spotify for Developers Dashboard](https://beta.developer.spotify.com/dashboard) and create your application. For the examples, we registered these Redirect URIs:

replace the `client_id`, `redirect_uri` and `client_secret` in the app.js file with the ones you get from My Applications.

## Running the app
In order to run:

    $ cd main
    $ node app.js

Then, open `http://localhost:8888` in a browser.
