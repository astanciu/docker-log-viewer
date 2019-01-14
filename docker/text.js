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

    const line = `${process.env.NAME} - ${new Date().toLocaleString()} - ${faker.company.catchPhrase()} - ${faker.hacker.phrase()} - ${faker.internet.userAgent()}`
    const manyLines = `${process.env.NAME} - ${new Date().toLocaleString()} - ${faker.company.catchPhrase()} - ${faker.hacker.phrase()} - ${faker.internet.userAgent()}
    ${process.env.NAME} - ${new Date().toLocaleString()} - ${faker.company.catchPhrase()} - ${faker.hacker.phrase()} - ${faker.internet.userAgent()}
    ${process.env.NAME} - ${new Date().toLocaleString()} - ${faker.company.catchPhrase()} - ${faker.hacker.phrase()} - ${faker.internet.userAgent()}
    ${process.env.NAME} - ${new Date().toLocaleString()} - ${faker.company.catchPhrase()} - ${faker.hacker.phrase()} - ${faker.internet.userAgent()}
    ${process.env.NAME} - ${new Date().toLocaleString()} - ${faker.company.catchPhrase()} - ${faker.hacker.phrase()} - ${faker.internet.userAgent()}
    ${process.env.NAME} - ${new Date().toLocaleString()} - ${faker.company.catchPhrase()} - ${faker.hacker.phrase()} - ${faker.internet.userAgent()}
    ${process.env.NAME} - ${new Date().toLocaleString()} - ${faker.company.catchPhrase()} - ${faker.hacker.phrase()} - ${faker.internet.userAgent()}
    ${process.env.NAME} - ${new Date().toLocaleString()} - ${faker.company.catchPhrase()} - ${faker.hacker.phrase()} - ${faker.internet.userAgent()}
    ${process.env.NAME} - ${new Date().toLocaleString()} - ${faker.company.catchPhrase()} - ${faker.hacker.phrase()} - ${faker.internet.userAgent()}
    ${process.env.NAME} - ${new Date().toLocaleString()} - ${faker.company.catchPhrase()} - ${faker.hacker.phrase()} - ${faker.internet.userAgent()}
    ${process.env.NAME} - ${new Date().toLocaleString()} - ${faker.company.catchPhrase()} - ${faker.hacker.phrase()} - ${faker.internet.userAgent()}
    ${process.env.NAME} - ${new Date().toLocaleString()} - ${faker.company.catchPhrase()} - ${faker.hacker.phrase()} - ${faker.internet.userAgent()}
    ${process.env.NAME} - ${new Date().toLocaleString()} - ${faker.company.catchPhrase()} - ${faker.hacker.phrase()} - ${faker.internet.userAgent()}
    `
    
    Math.random() < 0.8 ? console.log(line) : console.log(manyLines)
    await pause();
  }
}

async function pause(time = 1000) {
  time  = Math.random() * 1000
  return new Promise(res => {
    setTimeout(res, time);
  });
}
