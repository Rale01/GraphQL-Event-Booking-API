const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { blacklistedTokens } = require('../../middleware/is-auth');

let isManager = false;

module.exports = {
        createUser: async ({ userInput }) => {
            const { email, password, isManager } = userInput;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('User exists already.');
            }
        
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                email,
                password: hashedPassword,
                isManager: isManager || false, 
            });
            const result = await user.save();
        
            return { ...result._doc, _id: result.id, password: null };
        },
    

    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            'somesupersecretkey',
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { userId: user.id, email: user.email },
            'refreshsupersecretkey',
            { expiresIn: '7d' }
        );

        isManager = user.isManager;

        return { 
            userId: user.id,
            accessToken: accessToken, 
            refreshToken: refreshToken, 
            accessTokenExpiration: 1, 
            refreshTokenExpiration: 7 , 
            isManager: user.isManager
        };
    },

    logout: async ({ headers }) => {
        const accessToken = headers.authorizationwithaccesstoken;
        const refreshToken = headers.authorizationwithrefreshtoken;
        
        if (accessToken) {
            blacklistedTokens.add(accessToken);
        }
        if (refreshToken) {
            blacklistedTokens.add(refreshToken);
        }
        
        console.log(blacklistedTokens);
        return 'Logout successful';
    },
    
    
    isManager: () => isManager,

};