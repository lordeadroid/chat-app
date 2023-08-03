class Database {
  #directChats;
  #groupChats;

  constructor() {
    // this.#groupChats = {};
    this.#directChats = {};
  }

  addUser(username) {
    this.#directChats[username] = {};
  }

  createChat(from, to) {
    this.#directChats[from][to] = [];
    this.#directChats[to][from] = [];
    return [];
  }

  // getGroupChat(groupName) {
  //   return this.#groupChats[groupName];
  // }

  getDirectChat(username, remoteUser) {
    return this.#directChats[username][remoteUser];
  }

  storeDirectChats(sender, receiver, message) {
    const from = this.#directChats[sender];
    const to = this.#directChats[receiver];

    from[receiver].push({ sender, receiver, message });
    to[sender].push({ sender, receiver, message });
  }

  // storeGroupChats(groupName, message) {
  //   const group = this.#groupChats[groupName];
  //   group.push(message);
  // }

  connect(from, to) {
    const chat = this.#directChats[from][to];

    if (chat === undefined) {
      return this.createChat(from, to);
    }

    return [...chat];
  }

  // open(from, groupName) {}

  isPresent(username) {
    return Object.keys(this.#directChats).includes(username);
  }

  isNewUser(username) {
    return !this.isPresent(username);
  }

  get users() {
    return Object.values(this.#directChats);
  }
}

module.exports = Database;
