// Appears to be necessary for rollup :/
export default function(level, message) {
  if (process.env.NODE_ENV === 'production' && level !== 'error') {
    return;
  }

  console[level](message);
}
