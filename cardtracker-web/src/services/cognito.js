import {
	CognitoUserPool,
	CognitoUserAttribute,
    AuthenticationDetails,
	CognitoUser,
} from 'amazon-cognito-identity-js';

const poolRegion = "us-east-1";
const poolIdentityId = "us-east-1:bafd62ce-7b79-46dc-948d-67b683ea1deb";
const poolData = {
    UserPoolId : "us-east-1_0Qe9L22av",
    ClientId : "27kei534fja4jis9v57sl3p9h4"
};

function decodeJWT(jwt) {
    var raw_tokens = jwt.split(".");
    return atob(raw_tokens[1]);
}

function getAuthenticationDetials(email, password) {
    return new AuthenticationDetails({Username: email, Password: password});
}

function getCognitoUser(email) {
    return new CognitoUser({Username: email, Pool: getUserPool()});
}

function getUserPool() {
    return new CognitoUserPool(poolData);
}

// exports
export function getAuthorizationHeaders() {
    var user = getLoggedInUser();
    var authSession = getSession(user);
    return {'Authorization': `Bearer ${authSession.idToken.jwtToken}`};
}

export function getLoggedInUser() {
    var user = getUserPool().getCurrentUser();
    return user;
}

export function getSession(user){
    return user.getSession((err, response) => {
        if (err) {
            console.log(err);
            return;
        }
        return response;
    });
}

export function isUserInGroup(group) {
    var user = getLoggedInUser();
    var found = false
    if (!user) {
        return false;
    }
    var session = getSession(user);
    if (session.idToken.payload['cognito:groups']) {
        session.idToken.payload['cognito:groups'].forEach((user_group) => {
            if (user_group === group) {
                found = true;
            }
        });
    }
    return found;
}

export function isUserValid() {
    var user = getLoggedInUser();
    return !(!user);
}

export function resetPassword(session, new_password, userAttr) {
    return new Promise((resolve) => {
        session.completeNewPasswordChallenge(new_password, userAttr, {
            onSuccess: (result) => {
                const token = {
                    accessToken: result.getAccessToken().getJwtToken(),
                    idToken: result.getIdToken().getJwtToken(),
                    refreshToken: result.getRefreshToken().getToken(),
                };
                return resolve({
                    statusCode: 200,
                    response: token,
                    message: "password reset success"
                });
            },
            onFailure: (err) => {
                return resolve({
                    statusCode: 400,
                    response: null,
                    message: err.message || JSON.stringify(err)
                });
            }
        });
    });
}

export function signIn(email, password) {
    return new Promise((resolve) => {
        var user = getCognitoUser(email)
        user.authenticateUser(getAuthenticationDetials(email, password), {
            onSuccess: (result) => {
                const token = {
                    accessToken: result.getAccessToken().getJwtToken(),
                    idToken: result.getIdToken().getJwtToken(),
                    refreshToken: result.getRefreshToken().getToken(),
                };
                return resolve({
                    statusCode: 200,
                    response: token,
                    message: "loggin success"
                });
            },
            newPasswordRequired: (userAttr, requiredAttr) => {
                delete userAttr.email_verified;
                return resolve({
                    statusCode: 419, 
                    response: {user: user, userAttr: userAttr},
                    message: "password reset required"
                });
            },
            onFailure: (err) => {
                return resolve({
                    statusCode: 400,
                    response: null,
                    message: err.message || JSON.stringify(err)
                });
            },
        });
    });
}

export function signOutUser() {
    var user = getLoggedInUser();
    if (!user) {
        // nothing to do
        return;
    }
    user.signOut();
}

export function verify(email, code) {
    return new Promise((resolve) => {
        getCognitoUser(email).confirmRegistration(code, true, (err, result) => {
            if (err) {
                return resolve({ statusCode: 422, response: err });
            }
            return resolve({ statusCode: 400, response: result });
        });
    });
}
