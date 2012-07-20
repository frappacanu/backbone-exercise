var Track = Backbone.Model.extend({
  defaults: function() {
    return {
      //Moritz this is for you ;)
      id: 48907624,
      title: "Hello",
      permalink: "http://soundcloud.com/mr_mo/hello"
    };
  },
  
  initialize: function() {
    
  },

  clear: function() {
    this.destroy();
  }
});

var TrackView = Backbone.View.extend({
  tagName: "li",

  template: _.template($('#track-template').html()),

  events: {
    "click a.destroy": "clear",
    "click a.play": "play"
  },

  initialize: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  edit: function(event) {
    this.title = this.form.find("input[name=title]");
    this.description = this.form.find("textarea[name=description]");
    this.model.save({title: this.title.val(), description: this.description.val()});
    event.preventDefault();
  },

  clear: function() {
    this.model.clear();
  }
});