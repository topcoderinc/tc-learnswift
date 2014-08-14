module.exports = {

  db: process.env.MONGOLAB_URI|| 'mongodb://localhost:27017/learn2swift',
  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',
  
};
