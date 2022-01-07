const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m", // Más brillo
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  foreground: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    crimson: "\x1b[38m"
  },
  background: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
    crimson: "\x1b[48m"
  }
}

module.exports = (message, color, effect, background) => {
  if (background) {
    console.log(`${color ? `${effect ? `${colors.background[color]}${colors[effect]}` : `${colors.background[color]}`}` : ''}${message}\x1b[40m`);
  } else {
    console.log(`${color ? `${effect ? `${colors.foreground[color]}${colors[effect]}` : `${colors.foreground[color]}`}` : ''}${message}\x1b[0m`);
  }
  return;
};
