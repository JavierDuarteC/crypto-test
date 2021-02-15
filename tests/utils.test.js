const Utils = require('../configs/utils');

test('verificar si la variable es numérica', ()=>{
    const isNumber = Utils.isNumeric("3");
    expect(isNumber).toBe(false);
});

//passwords 
//