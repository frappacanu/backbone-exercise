var Playlist = Backbone.Model.extend({
  initialize: function() {
    this.tracks = new TrackCollection;
    this.tracks.add(Tracks.where({'playlist_id': this.id}));
    Tracks.bind('add', this.addTrack, this);
    Tracks.bind('remove', this.removeTrack, this);
  },

  addTrack: function(track) {
    this.tracks.add(track);
  },

  removeTrack: function(track) {
    this.tracks.remove(track);
  },

  clear: function() {
    var tracks = Tracks.where({'playlist_id' : this.id})
    _.each(tracks, function(model) { model.destroy(); });
    this.destroy();
  }
});

var PlaylistView = Backbone.View.extend({
  tagName: "li",

  template: _.template($('#playlist-template').html()),

  events: {
    "click .play-list": "playAll",
    "click .destroy-playlist": "clear",
    "click .edit": "displayEditView",
    "submit .edit-playlist": "edit"
  },

  initialize: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.remove, this);
    Tracks.bind('add', this.appendTrack, this);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.form = this.$('.edit-playlist');
    this.appendAllTracks();
    return this;
  },

  appendAllTracks: function() {
    _.each(this.model.tracks.models, _.bind(this.appendTrack, this));
  },

  appendTrack: function(track) {
    if(track.attributes.playlist_id == this.model.id) {
      var trackView = new TrackView({model: track});
      this.$('.tracks').append(trackView.render().el);
    }
  },

  edit: function(event) {
    this.title = this.form.find('input[name=title]');
    this.description = this.form.find('textarea[name=description]');
    this.form.hide();
    this.model.save({title: this.title.val(), description: this.description.val()});
    event.preventDefault();
  },

  displayEditView: function() {
    this.form.toggle();
  },

  playAll: function(event) {
    this.$('.play-list').toggleClass('playing');
    this.$('.tracks').toggle();
    if (this.model.tracks.models.length > 0) {
      this.playOne(0);
    }
  },

  playOne: function(index) {
    var container = this.$('.embedded-player')[index];
    if (index > 0) {
      $(this.$('.embedded-player')[index-1]).html('');
    }
    SC.oEmbed(this.model.tracks.models[index].attributes.permalink_url, { auto_play: true }, _.bind(function(oEmbed) {
      container.innerHTML = oEmbed.html;
      var widget = SC.Widget($(container).find('iframe')[0]);
      widget.bind('finish', _.bind(function() {
        if (this.model.tracks.models[index+1]) {
          this.playOne(index+1);
        }
      }, this));
    }, this));
  },

  clear: function() {
    this.model.clear();
  }
});

var PlaylistAsSelectOptionView = PlaylistView.extend({
  tagName: "option",

  events: {},

  initialize: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
    this.$el.html(this.model.attributes.title);
    this.$el.attr('value', this.model.id);
    return this;
  }
});

var PlaylistCollection = Backbone.Collection.extend({
  model: Playlist,
  
  localStorage: new Store('sc-playlists')
});

var Playlists = new PlaylistCollection;
