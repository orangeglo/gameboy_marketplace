Vue.component('listing-card', {
  props: ['listing'],
  data: function() {
    return {
      expanded: false,
      imageUrl: this.listing.imageUrls()[0]
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
              Card title
              <small class="text-muted">by {{listing.user()}}</small>
              <button class="btn btn-sm btn-light" style="float: right" @click="toggleExpanded">
                {{ expanded ? 'Collapse ▲' : ' Expand ▼' }}
              </button>
            </h5>
            <p class="card-text listing-text">{{listing.text()}}</p>
            <p class="card-text text-right">
              <a href="#" class="btn btn-sm btn-info">Open In Discord</a>
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
    listings: [new Listing({ user: 'orangegle', message: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."}),
    new Listing({ user: 'test', message: 'asdasd' })]
  },
  mounted: async function() {
    const jsonData = await (new DataFetcher).fetch();
    console.log(jsonData);
    for (var i = 0; i < jsonData.length; i++) {
      this.listings.push(new Listing(jsonData[i]))
    }
  }
});
