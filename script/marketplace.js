const DATA_URL = 'https://gameboy.github.io/dmgAPI/market.json'

class DataFetcher {
  async fetch() {
    return fetch(DATA_URL)
      .then((response) => {
        return response.json()
      })
      .then((jsonData) => {
        return jsonData
      })
      .catch((error) => {
        console.log(error);
      })
  }
}

class Listing {
  constructor(messageData) {
    this.messageData = messageData
    this.splitMessage = messageData.message.split(' ')
  }

  user() {
    return this.messageData.user
  }

  text() {
    return this.messageData.message
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
