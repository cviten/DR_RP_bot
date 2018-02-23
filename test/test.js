var chai = require('chai');
var assert = chai.assert;

describe("Title of collection of tests", function() {
  describe("Subtitle of collection of tests", function() { //Optional
      it("Description of the test", function() {
        let x = 3;
        assert.equal(x, 3); //Test
      });
      it("Test #2", function() {
        let x = 5;
        assert.equal(x, 5); //Test
      });
  })
});

describe("Second describe", function() {
  describe("Second sub-describe", function() { //Optional
      it("Description of the test", function() {
        let x = 3;
        assert.equal(x, 3); //Test
      });
      it("Test #2", function() {
        let x = 5;
        assert.equal(x, 5); //Test
      });
  })
});
