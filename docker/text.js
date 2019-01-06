go().catch(e => {
  console.log('Oops...', e);
});

async function go() {
  console.log('Started..');
  const name = process.env.NAME || 'TEXT1'
  while (true) {
    console.log(`${name} - This is a test: ${new Date().toLocaleString()}`);
    await pause();
  }
}

async function pause(time = 1000) {
  return new Promise(res => {
    setTimeout(res, time);
  });
}
