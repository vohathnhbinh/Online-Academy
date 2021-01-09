module.exports = hbs => {
    hbs.handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this)
    }),
    hbs.handlebars.registerHelper('ifIdEquals', function(arg1, arg2, options){
        return (arg1.equals(arg2)) ? options.fn(this) : options.inverse(this)
    })
}