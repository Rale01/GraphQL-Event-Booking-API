const jwt = require('jsonwebtoken');

const blacklistedTokens = new Set();

async function isAuth(req, res, next) {
    const accessToken = req.get('AuthorizationWithAccessToken');
    const refreshToken = req.get('AuthorizationWithRefreshToken');
    if (!accessToken && !refreshToken) {
        req.isAuth = false;
        return next();
    }

    if (blacklistedTokens.has(accessToken) && blacklistedTokens.has(refreshToken)) {
        req.isAuth = false;
        return next();
    }

    let decodedAccessToken;
    let decodedRefreshToken;
    try {
        if (accessToken) {
            decodedAccessToken = jwt.verify(accessToken, 'somesupersecretkey');
        }
        if (refreshToken) {
            decodedRefreshToken = jwt.verify(refreshToken, 'refreshsupersecretkey');
        }

        if (!decodedAccessToken && decodedRefreshToken) {
            const newAccessToken = jwt.sign(
                { userId: decodedRefreshToken.userId, email: decodedRefreshToken.email },
                'somesupersecretkey',
                { expiresIn: '1h' }
            );
            decodedAccessToken = jwt.verify(newAccessToken, 'somesupersecretkey');
        }
    } catch (err) {
        if (!decodedAccessToken && !decodedRefreshToken) {

            req.isAuth = false;
            return next();
        } else if (!decodedAccessToken) {

            req.isAuth = 'Unvalid';
            req.userId = decodedRefreshToken.userId;
            return next();
        } else {

            req.isAuth = false;
            return next();
        }
    }

    req.isAuth = true;
    req.userId = decodedAccessToken.userId;
    next();
}

module.exports = {
    blacklistedTokens,
    isAuth,
};



