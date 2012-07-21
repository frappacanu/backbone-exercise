var FrappCloud = Backbone.View.extend({
  el: $("#frappcloud"),
  
  events: {
    "submit #create-playlist":  "createPlaylist",
    "submit #search": "searchTracks"
  },

  initialize: function() {
    this.searchTerm = $("#search-term");
    this.form = $("#create-playlist");
    this.title = this.form.find("input[name=title]");
    this.description = this.form.find("textarea[name=description]");
    Playlists.bind('add', this.appendPlaylist, this);
    Playlists.bind('reset', this.appendAllPlaylists, this);
    Playlists.fetch();
  },
  
  render: function() {
    this.addAll();
  },

  appendPlaylist: function(playlist) {
    var view = new PlaylistView({model: playlist});
    this.$("#playlists").append(view.render().el);
  },

  appendAllPlaylists: function() {
    Playlists.each(this.appendPlaylist);
  },

  createPlaylist: function(event) {
    Playlists.create({title: this.title.val(), description: this.description.val()});
    event.preventDefault();
  },

  searchTracks: function(event) {
    var self = this;
    this.$("#search-results").html('');
    SC.get('/tracks', { q: this.searchTerm.val() }, function(tracks) {
      Tracks.add(tracks);
    });
    Tracks.bind('add', this.displaySearchResult, this);
    event.preventDefault();
  },

  displaySearchResult: function(track) {
    var view = new TrackAsSearchResultView({model: track});
    this.$("#search-results").append(view.render().el);
  }
});