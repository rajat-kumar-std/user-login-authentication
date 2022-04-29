const express = require('express'); //---------required imports------------
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/userModel');
const RefreshToken = require('./models/refreshTokenModel');

const connectToDB = require('./db'); //---------------- Database connection
connectToDB();
app.use(cors());
app.use(express.json()); //use data passed body as json

//---------------- Posts Routes
app.post('/posts', authenticateToken, (req, res) => {
  res.status(200).json({
    error: false,
    post: {
      title: 'A sample title',
      message: 'A sample beautiful quote for you.',
    },
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token)
    res
      .status(401)
      .json({ error: true, status: 'error', errorMessage: 'token missing' });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({
        error: true,
        status: 'error',
        errorMessage: 'token is invalid or expired',
      });
    req.user = user;
    next();
  });
}

app.get('/newtoken/:refresh_token', async (req, res) => {
  const refreshToken = req.params.refresh_token;
  if (!refreshToken)
    return res.status(401).json({
      status: 'error',
      error: true,
      errorMessage: 'refresh token missing',
    }); // we cannot send empty token (no token if we try to do so it will create a new route and will throw not found route)

  if (!(await refreshTokenIssued(refreshToken)))
    return res.status(403).json({
      status: 'error',
      error: true,
      errorMessage: 'refresh token not issued',
    });

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) {
        await deleteRefreshToken(refreshToken);
        return res.status(403).json({
          status: 'error',
          error: true,
          errorMessage: 'refresh token is expired (or invalid)', //invalid check already in db
        });
      }

      const accessToken = genAccessToken(
        { uname: user.uname, password: user.password },
        '2m' //token expiry
      );

      return res.status(201).json({
        status: 'created',
        result: 'access token created',
        accessToken: accessToken,
        error: false,
      });
    }
  );
});

async function refreshTokenIssued(token) {
  const refreshToken = await RefreshToken.findOne({ refreshToken: token });
  if (!refreshToken) return false;
  return true;
}

//--------------------- User Register Route
app.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      uname: req.body.uname,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      status: 'created',
      result: 'user successfully created',
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      errorMessage: `dublicate username found: ${err.message}`,
      error: true,
    });
  }
});

async function saveRefreshToken(token) {
  const refreshToken = new RefreshToken({
    refreshToken: token,
  });
  try {
    await refreshToken.save();
  } catch (err) {
    console.log('Error in saving refresh token:', err.message);
  }
}

async function deleteRefreshToken(token) {
  return await RefreshToken.deleteOne({
    refreshToken: token,
  });
}

//------------------------------------ User Login Route
app.post('/login', async (req, res) => {
  const user = await User.findOne({
    uname: req.body.uname,
  });

  if (!user)
    return res
      .status(400)
      .json({ error: true, status: 'error', errorMessage: 'user not found' });

  try {
    const verified = await bcrypt.compare(req.body.password, user.password);
    if (!verified) {
      return res.status(400).json({
        error: true,
        status: 'error',
        errorMessage: 'invalid password',
      });
    }

    const accessToken = genAccessToken(
      { uname: user.uname, password: user.password },
      '2m' //token expiry
    );
    const refreshToken = jwt.sign(
      { uname: user.uname, password: user.password },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '5m' } //token expiry
    );
    saveRefreshToken(refreshToken);
    return res.status(200).json({
      error: false,
      status: 'ok',
      result: 'login Sucess',
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, status: 'error', errorMessage: err.message });
  }
});

//------------------------------------ User Logout Route
app.delete('/logout/:refresh_token', async (req, res) => {
  const result = await deleteRefreshToken(req.params.refresh_token);
  console.log(result);
  res.status(204).send();
});

//----------- new access token genetator ---------
function genAccessToken(user, expiry) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiry });
}

//----------------------------------
app.listen(process.env.PORT, () =>
  console.log('Server is running on port', process.env.PORT)
);

//require('crypto').randomBytes(64).toString('hex')
