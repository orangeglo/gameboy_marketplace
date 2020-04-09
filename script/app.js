Vue.component('listing-card', {
  props: ['listing'],
  data: function() {
    return {
      expanded: false
    }
  },
  computed: {
    imageUrl: function() {
      return this.listing.imageUrls()[0]
    },
    unknown: function() {
      return (!this.listing.buy() && !this.listing.sell())
    }
  },
  methods: {
    toggleExpanded: function() { this.expanded = !this.expanded; }
  },
  template: `
    <div class="card" :class="{expanded: expanded}">
      <div class="row no-gutters">
        <div class="col-md-3">
          <div v-if="!imageUrl" class="no-image"></div>
          <img v-if="imageUrl" :src="imageUrl" class="card-img">
        </div>
        <div class="col-md-9">
          <div class="card-body" @click.self="toggleExpanded">
            <h5 class="card-title">
              <span v-if="listing.sell()" class="badge badge-primary">Selling</span>
              <span v-if="listing.buy()" class="badge badge-success">Buying</span>
              <span v-if="unknown" class="badge badge-secondary">???</span>
              Card title
              <small class="text-muted">by {{listing.user()}}</small>
              <img width="30" class="discord-avatar" :src="listing.avatarUrl">

              <button class="btn btn-sm btn-light pull-right" @click="toggleExpanded">
                {{ expanded ? 'Collapse ▲' : ' Expand ▼' }}
              </button>
            </h5>
            <p class="card-text listing-text">{{listing.text()}}</p>
            <p class="card-text">
              <span class="text-muted created">{{ listing.created }}</span>
              <span class="pull-right"><a :href="listing.discordUrl()" target="_blank" class="btn btn-sm btn-info">Open In Discord</a></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
});

let app = new Vue({
  el: '#app',
  data: {
    listings: (new DataFetcher).cachedListings()
  },
  mounted: async function() {
    const newListings = await (new DataFetcher).refreshListings();
    if (newListings) { this.listings = newListings; }
  }
});
