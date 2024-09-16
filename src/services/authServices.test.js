const { signUp } = require('./AuthServices');
const User = require('../model/users');
const { hashPassword } = require('../helper/hash');
const jwt = require('jsonwebtoken');

jest.mock('../model/users');
jest.mock('../helper/hash', () => ({ hashPassword: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn() }));

beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
    };
});

describe('test authentication user services', () => {
    describe('signUp', () => {
        it('should create a new user', async () => {
            req.body = { 
                name: "mohammed",
                email: "mohamedali123@gmail.com",
                password: "123456789",
                passwordConfirm: "123456789",
                role: "admin"
            };

            const hashedPassword = "hashedPassword";
            const newUser = {
                toJSON: () => ({
                    name: "mohammed",
                    email: "mohamedali123@gmail.com",
                    password: hashedPassword,
                    role: "admin"
                })
            };
            const token = "mockToken";

            hashPassword.mockReturnValue(hashedPassword);
            User.create.mockResolvedValue(newUser);
            jwt.sign.mockReturnValue(token);

            await signUp(req, res);

            expect(hashPassword).toHaveBeenCalledWith("123456789");
            expect(User.create).toHaveBeenCalledWith({
                name: "mohammed",
                email: "mohamedali123@gmail.com",
                password: hashedPassword,
                role: "admin"
            });
            expect(jwt.sign).toHaveBeenCalledWith(newUser.toJSON(), process.env.JWT_SCERET_KEY, { expiresIn: process.env.JWT_EX });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                state: 'ok',
                user: { ...newUser.toJSON(), password: undefined, passwordUpdate: undefined },
                token: token
            });
        });
    });
});

afterEach(() => {
    jest.clearAllMocks();
});
