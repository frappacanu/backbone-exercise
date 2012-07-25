var FrappCloud = Backbone.View.extend({
  el: $("#frappcloud"),
  
  events: {
    "submit #create-playlist": "createPlaylist",
    "submit #search": "searchTracks",
    "click #tabs a": "switchSection"
  },

  initialize: function() {
    SC.initialize({
      client_id: "6b31723478aaf7f7358de19cf38334d6"
    });
    this.searchTerm = $("#search-term");
    this.form = $("#create-playlist");
    this.title = this.form.find("input[name=title]");
    this.description = this.form.find("textarea[name=description]");
    Tracks.fetch();
    Playlists.bind('reset', this.appendAllPlaylists, this);
    Playlists.bind('add', this.appendPlaylist, this);
    Playlists.fetch();

  },
  
  render: function() {
    this.addAll();
  },

  appendPlaylist: function(obj) {
    obj.playlistView = new PlaylistView({model: obj});
    this.$("#playlists").append(obj.playlistView.render().el);
  },

  appendAllPlaylists: function() {
    Playlists.each(this.appendPlaylist);
  },

  createPlaylist: function(event) {
    var playlist = Playlists.create({title: this.title.val() || "Untitled", description: this.description.val()});
    event.preventDefault();
  },

  searchTracks: function(event) {
    var SearchResults = new TrackCollection;
    this.$("#search-results").html('');
    SC.get('/tracks', { q: this.searchTerm.val(), limit: 10 }, function(tracks) {
      if (tracks.length < 1) {
        $("#search-results").append("<li>No results</li>");
        return;
      }
      SearchResults.add(tracks);
      SearchResults.each(function(track){
        var view = new TrackAsSearchResultView({model: track});
        $("#search-results").append(view.render().el);
      });
    });
    event.preventDefault();
  },

  switchSection: function(event) {
    var sectionChooser = $(event.target);
    $("#tabs li").removeClass("current")
    sectionChooser.parent().addClass("current");
    $("section").hide();
    $(sectionChooser.attr("href")).show();
    event.preventDefault();
  }
});






