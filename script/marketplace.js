const DATA_URL = 'https://gameboy.github.io/dmgAPI/market.json'
const BUY_REGEX = /buying|WTB|looking for/ig
const SELL_REGEX = /selling|WTS/ig
const BASE_DISCORD_URL = "https://discordapp.com/channels/246604458744610816/336895311081373707/" // just add message_id

class DataFetcher {
  cachedListings() {
    // return [new Listing({ user: 'orangegle', message: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."}),
    // new Listing({ user: 'test', message: 'asdasd' })];
    return this.buildListings(JSON.parse(localStorage.getItem('listingData')) || []) 
  }

  async refreshListings() {
    return fetch(DATA_URL)
      .then((response) => {
        return response.json()
      })
      .then((jsonData) => {
        console.log(jsonData);
        if (jsonData.length > 0) {
          localStorage.setItem('listingData', JSON.stringify(jsonData))
          return this.buildListings(jsonData);
        } else {
          console.log("empty listing data")
          return null;
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  buildListings(jsonData) {
    const listings = []
    for(let i = 0; i < jsonData.length; i++) {
      console.log("loop")
      listings.push(new Listing(jsonData[i]))
    }
    return listings
  }
}

class Listing {
  constructor(messageData) {
    this.messageData = messageData
    this.messageId = messageData.message_id
    this.created = messageData.created
    this.avatarUrl = messageData.avatar_url
    this.splitMessage = messageData.message.split('\n').map(line => line.split(' ')).flat()
  }

  user() {
    return this.messageData.user
  }

  text() {
    return this.messageData.message
  }

  discordUrl() {
    return BASE_DISCORD_URL + this.messageId
  }

  sell() {
    if (!this._sell) {
      this._sell = false;

      for (let i = 0; i < this.splitMessage.length; i++) {
        const word = this.splitMessage[i];
        if (word.match(SELL_REGEX)) {
          this._sell = true;
        }
      }
    }

    return this._sell;
  }

  buy() {
    if (!this._buy) {
      this._buy = false;

      for (let i = 0; i < this.splitMessage.length; i++) {
        const word = this.splitMessage[i];
        if (word.match(BUY_REGEX) && !this.sell()) {
          this._buy = true;
        }
      }
    }

    return this._buy;
  }

  imageUrls() {
    if (!this._imageUrls) {
      this._imageUrls = []

      for (let i = 0; i < this.splitMessage.length; i++) {
        const word = this.splitMessage[i];
        if (word.match(/.jpg$|.gif$|.png$/g)) {
          this._imageUrls.push(word)
        }
      }
    }

    return this._imageUrls;
  }
}
