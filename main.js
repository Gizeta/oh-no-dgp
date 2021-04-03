const spawn = require('child_process').spawn;
const config = require('./config');

const args = process.argv.slice(2);

const product_id = args.find(x => !x.startsWith('--'));
const app = config.games.find(x => x.product_id === product_id);

let viewer_id, onetime_token;
if (args.includes('--no-refresh-token')) {
  const auth = config.auth.game_token.find(x => x.product_id === product_id);
  viewer_id = auth.viewer_id;
  onetime_token = auth.onetime_token;
} else {
  throw new Error('not implement yet');
  // const getToken = require('./scripts/app_start');
}

spawn(app.path, [`/viewer_id=${viewer_id}`, [`/onetime_token=${onetime_token}`]], {
  stdio: 'ignore',
  detached: true
}).unref();
