var Track = Backbone.Model.extend({
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
    "click .destroy-track": "clear",
    "click .play": "play"
  },

  initialize: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  play: function(event) {
    SC.oEmbed(this.model.attributes.permalink_url, { auto_play: true }, this.$('.embedded-player')[0]);
    event.preventDefault();
  },
  
  clear: function() {
    this.model.clear();
  }
});

var TrackAsSearchResultView = TrackView.extend({
  template: _.template($('#search-result-template').html()),

  events: {
    "submit .add-to-playlist": "addToPlaylist",
    "click .play": "play"
  },
  
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    Playlists.each(_.bind(function(playlist){
      var view = new PlaylistAsSelectOptionView({model: playlist});
      this.$el.find('.select-playlist').append(view.render().el);
    }, this));
    Playlists.bind('add', this.appendOptionToSelect, this);
    return this;
  },

  appendOptionToSelect: function(obj) {
    var view = new PlaylistAsSelectOptionView({model: obj});
    this.$('.select-playlist').append(view.render().el);
  },

  addToPlaylist: function(event) {
    if (Playlists.length == 0) {
      Playlists.create({title: "Untitled", description: ""});
    }
    var playlist_id = this.$('.select-playlist').val();

    Tracks.create({
      playlist_id : playlist_id,
      track_id: this.model.id,
      title: this.model.attributes.title,
      permalink_url: this.model.attributes.permalink_url      
    })
    
    event.preventDefault();
  }
});

var TrackCollection = Backbone.Collection.extend({
  model: Track
});

var StoredTrackCollection = TrackCollection.extend({
  localStorage: new Store('sc-tracks')
});

var Tracks = new StoredTrackCollection;
