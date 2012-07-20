var Playlist = Backbone.Model.extend({
  defaults: function() {
    return {
      title: "Untitled",
      description: "",
      tracks: []
    };
  },
  
  initialize: function() {
    if (!this.get("title")) {
      this.set({"title": this.defaults.title});
    }
  },

  clear: function() {
    this.destroy();
  }
});

var PlaylistView = Backbone.View.extend({
  tagName: "li",

  template: _.template($('#playlist-template').html()),

  events: {
    "click a.destroy": "clear",
    "submit .edit-playlist": "edit"
  },

  initialize: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.form = this.$(".edit-playlist");
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



var PlaylistCollection = Backbone.Collection.extend({
  model: Playlist,
  
  localStorage: new Store("sc-playlists"),
});

var Playlists = new PlaylistCollection;
