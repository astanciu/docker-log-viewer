const faker = require('faker')
go().catch(e => {
  console.log('Oops...', e);
});

async function go() {
  console.log('Started..');
  const name = process.env.NAME || 'TEXT1'
  while (true) {
    const t1 = faker.company.catchPhrase()
    const t2 = faker.hacker.phrase()
    const t3 = faker.internet.userAgent()

    console.log(`${name} - ${new Date().toLocaleString()} - ${t1} - ${t2} - ${t3}`);
    await pause();
  }
}

async function pause(time = 1000) {
  time  = Math.random() * 1000
  return new Promise(res => {
    setTimeout(res, time);
  });
}
