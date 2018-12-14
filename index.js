const express = require('express'),
    ejs = require('ejs'),
    path = require('path'),
    querystring = require('querystring'),
    sslRedirect = require('heroku-ssl-redirect');

const app = express();

// Force SSL
app.use(sslRedirect());

// View directory
app.set('views', path.join(__dirname, 'public'));

// Template Engine
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

app.get(/\/embed\/(javascript|iframe|popup)\/(.*)/, (req, res) => {
    res.render('embed', {
        domain: `${req.hostname}${process.env.NODE_ENV === 'production'?'':`:${PORT}`}`,
        type: req.params[0],
        path: req.params[1],
        protocol: `http${process.env.NODE_ENV === 'production'?'s':''}`,

    });
});

app.get(/\/(.*)/, function (req, res) {
    const qString = querystring.stringify(req.query || {});
    res.redirect(`https://www.surveygizmo.com/${req.params[0]}${qString?`?${qString}`:''}`);
});

app.listen(PORT, function () {
    console.log(`SurveyGizmo listening on port ${PORT}!`);
});