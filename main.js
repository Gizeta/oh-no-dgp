const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');
const readline = require("readline");
const config = require('./config');

if (process.platform !== 'win32') {
  throw new Error('not support on non-Windows system');
}

const args = process.argv.slice(2);

const product_id = args.find(x => !x.startsWith('--'));
const app = config.games.find(x => x.product_id === product_id);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async function () {
  let needSaveConfig = false;

  if (!args.includes('--no-check-dgp-version')) {
    const dgplib = require('./scripts/dgplib');
    const newVersion = await dgplib.getDGPVersion();
    if (config.device.native_version !== newVersion) {
      needSaveConfig = true;
      config.device.native_version = newVersion;
    }
  }

  if (args.includes('--generate-device-info')) {
    throw new Error('not implement yet');
    needSaveConfig = true;
    config.device.mac_address = '';
    config.device.hdd_serial = '';
    config.device.motherboard = '';
    config.device.os_type = process.platform === 'win32' ? 'win' : 'mac';
  }

  if (args.includes('--login-dmm') || !config.auth.token || !config.auth.access_token || config.auth.expire < Date.now() / 1000) {
    needSaveConfig = true;
    const email = await new Promise((resolve) => rl.question('email:\n', resolve));
    const password = await new Promise((resolve) => rl.question('password:\n', resolve));
    const dgplib = require('./scripts/dgplib');
    const result = await dgplib.login(email, password);
    config.auth.access_token = result.access_token;
    config.auth.token = result.token;
    config.auth.expire = result.expire;
  }

  let viewer_id, onetime_token;
  if (args.includes('--no-refresh-token')) {
    const auth = config.auth.game_token.find(x => x.product_id === product_id);
    viewer_id = auth.viewer_id;
    onetime_token = auth.onetime_token;
  } else {
    needSaveConfig = true;
    const dgplib = require('./scripts/dgplib');
    dgplib.init(config);
    const result = await dgplib.getOnetimeToken(product_id);
    const auth = config.auth.game_token.find(x => x.product_id === product_id);
    viewer_id = auth.viewer_id = result.viewer_id;
    onetime_token = auth.onetime_token = result.onetime_token;
  }

  if (args.includes('--update-game-asset')) {
    throw new Error('not implement yet');
  }

  if (needSaveConfig) {
    console.log('write new config');
    await fs.writeFile(path.resolve(__dirname, './config.js'), `module.exports = ${JSON.stringify(config, null, 2)}`, () => { });
  }

  spawn(app.path, [`/viewer_id=${viewer_id}`, [`/onetime_token=${onetime_token}`]], {
    stdio: 'ignore',
    detached: true
  }).unref();

  rl.close();
})();
