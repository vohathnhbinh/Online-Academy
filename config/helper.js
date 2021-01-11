module.exports = hbs => {
    hbs.handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this)
    }),
    hbs.handlebars.registerHelper('ifIdEquals', function(arg1, arg2, options) {
        if(arg1 != null && arg2 != null) {
            return (arg1.equals(arg2) ) ? options.fn(this) : options.inverse(this)
        } else return options.inverse(this)
    }),
    hbs.handlebars.registerHelper('ifIdNotEquals', function(arg1, arg2, options) {
        if(arg1 != null && arg2 != null) {
            return (!arg1.equals(arg2) ) ? options.fn(this) : options.inverse(this)
        } else return options.inverse(this)
    })
}