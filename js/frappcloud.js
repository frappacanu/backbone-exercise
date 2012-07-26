var FrappCloud = Backbone.View.extend({
  el: $("#frappcloud"),
  
  events: {
    "submit #create-playlist": "createPlaylist",
    "submit #search": "submitSearch",
    "click #tabs a": "switchSection",
    "click #load-more": "searchTracks"
  },

  initialize: function() {
    SC.initialize({
      client_id: "6b31723478aaf7f7358de19cf38334d6"
    });
    this.searchTerm = $("#search-term");
    this.form = $("#create-playlist");
    this.title = this.form.find("input[name=title]");
    this.description = this.form.find("textarea[name=description]");
    this.resultsContainer = this.$('#search-results');
    Tracks.fetch();
    Playlists.bind('reset', this.appendAllPlaylists, this);
    Playlists.bind('add', this.appendPlaylist, this);
    Playlists.fetch();
    this.offset = 0;
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

  searchTracks: function() {
    var SearchResults = new TrackCollection;
    SC.get('/tracks', { q: this.searchTerm.val(), limit: 10, offset: this.offset }, _.bind(function(tracks) {
      if (tracks.length < 1) {
        $("#search-results").append("<li>No results</li>");
        return;
      }
      SearchResults.add(tracks);
      SearchResults.each(_.bind(function(track) {
        var view = new TrackAsSearchResultView({model: track});
        this.resultsContainer.append(view.render().el);
      }, this));
      if (this.offset == 0) {
        this.resultsContainer.after($('<a href="#load-more" class="box load-more" id="load-more">Load More</a>'));
      }
      this.offset += 10;
    }, this));
  },

  submitSearch: function(event) {
    this.offset = 0;
    this.resultsContainer.html('');
    this.searchTracks();
    $("#load-more").remove();
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