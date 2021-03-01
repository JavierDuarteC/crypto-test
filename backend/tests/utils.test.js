const varType = require('../utils/varType');
const validator = require('../utils/validator');
 
test('verificar si la variable es numérica', ()=>{
    let isNumber = varType.isNumeric("3");
    expect(isNumber).toBeFalsy();
    isNumber = varType.isNumeric(3);
    expect(isNumber).toBeTruthy();
});

test('verificar si la contraseña cumple con los requerimientos mínimos', ()=>{
    let isValid = validator.passwordIsValid("123asd");
    expect(isValid).toBeFalsy();
    isValid = validator.passwordIsValid("1Abcdefg");
    expect(isValid).toBeTruthy();
});