import {IPageMain} from "../../elements/pages/main/IPageMain";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var hbs = require('hbs');

export class AppServerListener implements IPageMain {

  private USE_SCSS = false;
  private FAVICON_PATH: string = "../../../client/app/assets/favicon.png";

  public express = express();
  expressViews: Array<string> = new Array();

  constructor() {
  }

  init() {

    // view engine setup
    this.express.set('view engine', 'hbs');
    this.express.use(favicon(path.join(__dirname, this.FAVICON_PATH)));

    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({extended: false}));
    this.express.use(cookieParser());

    // Use bower components
    this.express.use('/src/client', express.static(path.join(__dirname, '../../../../src/client')));
    this.express.use('/dist', express.static(path.join(__dirname, '../../../../dist')));
    this.express.use('/bower_components', express.static(path.join(__dirname, '../../../../bower_components')));
  }

  public registerPage(page: any) {
    var viewsPath = path.join(page.getPath(), '/views');
    this.expressViews.push(viewsPath);
    this.express.set('views', this.expressViews);
    hbs.registerPartials(viewsPath);
    this.express.use('/stylesheets', express.static(path.join(page.getPath(), 'stylesheets')));
    this.express.use('/assets', express.static(path.join(page.getPath(), 'stylesheets')));

    if (this.USE_SCSS) {
      this.express.use(sassMiddleware({
        src: path.join(page.getPath(), 'stylesheets'),
        dest: path.join(page.getPath(), 'stylesheets'),
        indentedSyntax: false, // true = .sass and false = .scss
        sourceMap: true
      }));
    }
  }

  renderPage(res, viewName: string, title: string, description: string, keywords: string, disableIndexing: boolean) {
    res.render(viewName, {
      title: title,
      description: description,
      keywords: keywords,
      disableIndexing: disableIndexing,
      layout: "layout"
    });
  }
}
