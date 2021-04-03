module.exports = {
  "device": {
    "mac_address": "",   // optional
    "hdd_serial": "",    // optional
    "motherboard": "",   // optional
    "os_type": "",       // optional
    "native_version": "2.5.8",
    "type": "cl",
    "launch_type": "LIB"
  },
  "games": [{
    "product_id": "game",
    "path": "PATH\\TO\\YOUR\\DMM\\game.exe"
  }],
  "auth": {
    "token": "",         // optional
    "access_token": "",  // optional
    "game_token": [{     // DON'T TOUCH, MAY BE REWRITTEN
      "product_id": "game",
      "viewer_id": "",
      "onetime_token": ""
    }]
  }
}
