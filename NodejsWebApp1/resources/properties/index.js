switch (process.env.NODE_ENV) {
    case 'development':
        module.exports = require('./devproperties');
        break;

        case 'production':
        module.exports =  require('./prodproperties');
        break;

        default:
        module.exports =  require('./devproperties');
};