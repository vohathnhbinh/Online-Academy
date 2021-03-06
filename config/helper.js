module.exports = (hbs) => {
  hbs.handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  }),
    hbs.handlebars.registerHelper('ifIdEquals', function (arg1, arg2, options) {
      if (arg1 != null && arg2 != null) {
        return arg1.equals(arg2) ? options.fn(this) : options.inverse(this);
      } else return options.inverse(this);
    }),
    hbs.handlebars.registerHelper(
      'ifIdNotEquals',
      function (arg1, arg2, options) {
        if (arg1 != null && arg2 != null) {
          return !arg1.equals(arg2) ? options.fn(this) : options.inverse(this);
        } else return options.inverse(this);
      }
    ),
    hbs.handlebars.registerHelper(
      'dateFormat',
      require('handlebars-dateformat')
    ),
    hbs.handlebars.registerHelper('isNew', function (arg, options) {
      if (arg) {
        const today = new Date();
        const createdOn = new Date(arg);
        const dayDiff =
          (today.getTime() - createdOn.getTime()) / (1000 * 60 * 60 * 24);
        if (dayDiff <= 7) return options.fn(this);
        return options.inverse(this);
      } else return options.inverse(this);
    }),
    hbs.handlebars.registerHelper('isHot', function (arg, options) {
      if (arg) {
        if (arg >= 4.5) return options.fn(this);
        return options.inverse(this);
      } else return options.inverse(this);
    }),
    hbs.handlebars.registerHelper('toLocale', function (arg) {
      return arg.toLocaleString('it-IT', {
        style: 'currency',
        currency: 'VND',
      });
    }),
    hbs.handlebars.registerHelper('calSale', function (arg1, arg2) {
      return (arg1 * (1 - arg2 / 100)).toLocaleString('it-IT', {
        style: 'currency',
        currency: 'VND',
      });
    });
};
