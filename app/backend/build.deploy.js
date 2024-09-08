const archiver = require('archiver');
const fs = require('fs');

const createDeployZip = () => {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(`${__dirname}/cell_count_${new Date().getTime()}.zip`);

  return new Promise((resolve, reject) => {
    archive
      .directory(`${__dirname}/dist`, 'dist')
      .directory(`${__dirname}/migrations`, 'migrations')
      .directory(`${__dirname}/seeds`, 'seeds')
      .file(`${__dirname}/db.constants.js`, { name: 'db.constants.js' })
      .file(`${__dirname}/ormconfig.js`, { name: 'ormconfig.js' })
      .file(`${__dirname}/package.json`, { name: 'package.json' })
      .file(`${__dirname}/package-lock.json`, { name: 'package-lock.json' })
      .file(`${__dirname}/tsconfig.json`, { name: 'tsconfig.json' })
      .file(`${__dirname}/Procfile`, { name: 'Procfile' })
      .file(`${__dirname}/.npmrc`, { name: '.npmrc' })
      .on('error', err => reject(err))
      .pipe(stream)
    ;

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

createDeployZip()