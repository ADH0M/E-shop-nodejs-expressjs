require('dotenv').config();
const signUp = require('./src/services/AuthServices');
const User   = require('./src/model/users');

jest.mock('./src/model/users');
jest.mock('./src/helper/hash.js',()=>({hashPassword: jest.fn(), isValidHash: jest.fn()}) );
jest.mock('./src/helper/authJWT.js' ,()=>({token:jest}));

beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
    };
});



describe('authentication service ', () => {
    describe('sign up ', () => {
        it('should first', () => { 
            req.body ={
                email: "mohamedali123@gmail.com",
                password: "123456789",
                passwordConfirm: "123456789",
                name: "mohammed",
                role: "admin"
            };


         })
    })
    
})





afterEach(() => {
    jest.clearAllMocks();
});


// test ('mocked function ' ,()=>{
//     const mocked = jest.fn();
//     mocked.mockReturnValue(6);
//     expect(mocked()).not.toBe(9)
//     expect(add(1,5)).not.toBe(7);

// })
