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

  addToPlaylist: function() {
    console.log("adding");
  },

  play: function(event) {
    SC.stream("/tracks/"+this.model.id, function(sound){
      sound.play();
    });
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
    "click a.play": "play"
  }
});


var TrackCollection = Backbone.Collection.extend({
  model: Track
});

var Tracks = new TrackCollection;
