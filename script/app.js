Vue.component('filtering', {
  props: ['listings'],
  data: function() {
    return {
      searchTerm: "",
      buying: true,
      selling: true,
      unknown: true
    }
  },
  computed: {
    trimmedSearchTerm: function() {
      return this.searchTerm.trim();
    }
  },
  methods: {
    emitFilteredListings() {
      this.$emit(
        'filtered-listings-updated',
        this.listings.filter((listing) => {
          if (this.trimmedSearchTerm.length >= 3) {
            return this.searchFilter(listing) && this.typeFilter(listing);
          } else {
            return this.typeFilter(listing);
          }
        })
      );
    },
    typeFilter(listing) {
      if (this.buying && listing.buy()) { return true }
      else if (this.selling && listing.sell()) { return true }
      else if (this.unknown && !listing.buy() && !listing.sell()) { return true }
      return false;
    },
    searchFilter(listing) {
      return listing.text().match(new RegExp(this.trimmedSearchTerm, 'ig'));
    }
  },
  template: `
    <div class='filtering'>
      <div class='search'>
        <input type='text' v-model:value="searchTerm" placeholder="Enter a search term" class="form-control form-control-sm" @keyup="emitFilteredListings"/>
      </div>
      <div class='type-filter'>
        <input type="checkbox" id="show-selling" v-model="selling" @change="emitFilteredListings"/>
        <span class="badge badge-primary"><label for="show-selling">Selling</label></span>
        <input type="checkbox" id="show-buying" v-model="buying" @change="emitFilteredListings"/>
        <span class="badge badge-success"><label for="show-buying">Buying</label></span>
        <input type="checkbox" id="show-unknown" v-model="unknown" @change="emitFilteredListings"/>
        <span class="badge badge-secondary"><label for="show-unknown">???</label></span>
      </div>
    </div>
  `
});

Vue.component('listing-card', {
  props: ['listing', 'closeFunction'],
  data: function() {
    return {
      expanded: false,
    }
  },
  computed: {
    imageUrl: function() {
      return this.listing.imageUrls()[0]
    },
    unknown: function() {
      return (!this.listing.buy() && !this.listing.sell())
    },
    bodyHtml: function() {
      return (this.expanded ? this.listing.expandedHtml() : this.listing.collapsedHtml())
    }
  },
  methods: {
    expand: function() {
      this.$emit('close-all')
      this.expanded = true
    },
    close: function() {
      this.expanded = false
    },
    toggleExpanded: function(e){
      this.expanded = !this.expanded
      e.stopImmediatePropagation()
    }
  },
  template: `
    <div class="card" :class="{expanded: expanded}">
      <div class="row no-gutters">
        <div class="col-md-3">
          <div v-if="!imageUrl" class="no-image"></div>
          <a v-if="imageUrl" :href="imageUrl"><img  :src="imageUrl" class="card-img"></a>
        </div>
        <div class="col-md-9">
          <div class="card-body" @click="expand">
            <h5 class="card-title">
              <div class="row">
                <div class="col-md-9">
                  <span v-if="listing.sell()" class="badge badge-primary">Selling</span>
                  <span v-if="listing.buy()" class="badge badge-success">Buying</span>
                  <span v-if="unknown" class="badge badge-secondary">???</span>
                  {{listing.title()}}

                  <div class="created">
                    <span class="text-muted">
                      posted
                      {{ listing.created }}
                      by
                    </span>
                    <img width="20" class="discord-avatar" :src="listing.avatarUrl">
                    <span>{{listing.user()}}</span>
                  </div>
                </div>

                <div class="col-md-3">
                  <a :href="listing.discordUrl()" target="_blank" class="btn btn-sm btn-info pull-right">Open In Discord</a>
                </div>
              </div>
            </h5>
            <p class="card-text listing-text" v-html="bodyHtml" ref="text"></p>

            <div style="z-index: 2; text-align: right;">
              <button class="btn btn-sm btn-outline-secondary" @click="toggleExpanded">
                {{ expanded ? '▲' : '▼' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});

let app = new Vue({
  el: '#app',
  data: {
    listings: (new DataFetcher).cachedListings(),
    filteredListings: null
  },
  mounted: async function() {
    this.filteredListings = this.listings;
    const newListings = await (new DataFetcher).refreshListings();
    if (newListings) {
      this.listings = newListings;
      this.filteredListings = newListings;
    }
  },
  methods: {
    closeAll: function() {
      for (let i = 0; i < this.listings.length; i++) {
        this.$refs[this.listings[i].messageId][0].close()
      }
    },
    updateFilteredListings: function(filteredListings) {
      this.filteredListings = filteredListings;
    }
  }
});
