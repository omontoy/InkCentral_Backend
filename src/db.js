const mongoose = require ('mongoose');

function connect() {
  const mongoURI =  'mongodb://localhost:27017/inkcentral'
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  mongoose.connection.once('open', () =>
    console.log('Connected with InkCentral Database')
  );

  mongoose.connection.on('error', (err) =>
    console.log('Something went wrong')
  );
}

module.exports = { connect }