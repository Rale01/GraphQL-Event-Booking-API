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
        // Generate new access token if refresh token is valid
        if (!decodedAccessToken && decodedRefreshToken) {
            const newAccessToken = jwt.sign(
                { userId: decodedRefreshToken.userId, email: decodedRefreshToken.email },
                'somesupersecretkey',
                { expiresIn: '1h' }
            );
            res.set('AuthorizationWithAccessToken', newAccessToken);
        }
    } catch (err) {
        if (!decodedAccessToken && !decodedRefreshToken) {
            // Both tokens are invalid
            req.isAuth = false;
            return next();
        } else if (!decodedAccessToken) {
            // Access token is invalid
            req.isAuth = 'Unvalid';
            req.userId = decodedRefreshToken.userId;
            return next();
        } else {
            // Refresh token is invalid
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



