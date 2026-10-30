const net = require('node:net');

// The Studio CLI has no host option. Restrict wildcard listeners to loopback
// for this local preview process without modifying the installed package.
const originalListen = net.Server.prototype.listen;
net.Server.prototype.listen = function (...args) {
  const options = args[0];
  if (options && typeof options === 'object' && 'port' in options &&
      (!options.host || options.host === '0.0.0.0' || options.host === '::')) {
    args[0] = {...options, host: '127.0.0.1'};
  }
  return originalListen.apply(this, args);
};
