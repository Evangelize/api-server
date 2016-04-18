var fs = require('fs'),
    pem = require('pem'),
    certInfo = {
        days: 712,
        selfSigned: true,
        issuer : {},
        country: 'US',
        state: 'Texas',
        locality: 'College Station',
        organization: 'evangelize.io',
        commonName: 'evangelize.io',
        emailAddress: 'support@evangelize.io'
    };

pem.createCertificate(
  certInfo,
  function(err, keys){
    fs.writeFile('private.pem', keys.certificate, (err) => {
      if (err) throw err;
      fs.writeFile('private.key', keys.serviceKey, (err) => {
        if (err) throw err;
        console.log('certificate generated');
        process.exit();
      });
    });
  }
);
