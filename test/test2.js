var chai = require('chai');
var assert = chai.assert;

describe("Persona", function() {
  describe("Yukari", function() { //Optional
      it("Garu", function() {
        let x = 3;
        assert.equal(x, 3); //Test
      });
      it("Dia", function() {
        let x = 5;
        assert.equal(x, 5); //Test
      });
  })
});

describe("DRV3", function() {
  describe("Kaede", function() { //Optional
      it("Talent", function() {
        let x = 3;
        assert.equal(x, 3, "You don't have talent"); //Test
      });
      it("Piano", function() {
        let x = 5;
        assert(false,"Piano is not found"); //Test
      });
  })
});
