import path from 'path';


import config from '../config';

export default function () {
    const app = this;
    config.clientRoutes.forEach(function(route){
        app.get(route, function(req, res){
            res.render('index', { isProd() {
                return process.env.NODE_ENV === 'production';
            }}, function(err, html){
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.send(html);
            });
        });
    });
}
