const fs = require('fs');
const { URL } = require('url');

const url = 'https://ts1.tc.mm.bing.net/th/id/R-C.148a4f2a5c1e64dba8ffa43c650345e3?rik=yTYoO1j%2fEWZkxQ&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f50047%2f7161.jpg_wh1200.jpg&ehk=E3kxXPOt3WNVmFh2GRWUkzMuX6N11jviTq5tbGCUpLE%3d&risl=&pid=ImgRaw&r=0';
const outPath = 'images/bing_7161.jpg';

function download(u, dest) {
  const parsed = new URL(u);
  const lib = parsed.protocol === 'https:' ? require('https') : require('http');

  const req = lib.get(u, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      download(res.headers.location, dest);
      return;
    }
    if (res.statusCode !== 200) {
      console.error('HTTP_ERROR', res.statusCode);
      process.exit(2);
    }
    const fileStream = fs.createWriteStream(dest);
    res.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      const stats = fs.statSync(dest);
      console.log('DOWNLOAD_OK');
      console.log(dest, stats.size);
    });
  });

  req.on('error', (err) => {
    console.error('DOWNLOAD_ERROR', err.message);
    process.exit(1);
  });
}

download(url, outPath);
