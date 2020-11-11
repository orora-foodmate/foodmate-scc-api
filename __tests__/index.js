const { connection } = require("../models");

// This is just for organisation and reporting
describe('Our application', function() {

  beforeAll(async (done) => {
    try {
      await connection.dropDatabase();
      done();
    }catch(error) {
      done(error);
    }
    
  });
  // This is the name of the test
  it('should understand basic mathematical principles', function(done) {

    // We want this test to pass.
    if (5 == 5) {
      // If the behavior is as expected, call done with no argument.
      done();
    } else {
      // Otherwise, call done with an error.
      done(new Error("Not sure what's happened."));
    }

  });

});