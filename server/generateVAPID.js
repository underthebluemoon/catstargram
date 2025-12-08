import webpush from 'web-push';

const keys = webpush.generateVAPIDKeys();

//                                     ↱ indent
console.log(JSON.stringify(keys, null, 2))

// node .\generateVAPID.js