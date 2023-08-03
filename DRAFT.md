```js
DataBase {
  ## properties
  directChats: {
    userA: {
      userB:[ {type, message}, ...messages],
      userC:[...messages],
    }

    userB: {
      userA:[...messages],
      userC:[...messages],
    }
  }

  groupChats: {
    groupA: {
      users: [...users],
      messages: [{sender, message},...messages]
    }

    groupB: {
      users: [...users],
      messages: [{sender, message},...messages]
    }
  }

  ## methods

  getGroupChat(username);
  getDirectChat(username);

  connect(from, to) {
    return getDirectChat(username);
  }

  open(from, groupName) {
    return getGroupChat(username);
  }

  storeDirectChats(clientUser, remoteUser, message) {
    const user = this.#directChats[clientUser];
    user[remoteUser].push(message);
  }

  storeGroupChats(groupName, message) {
    const group = this.#groupChats[groupName];
    group.push(message);
  }

  joinGroup(groupName, username) {

  }

  exitGroup(groupName, username) {

  }

  createGroup(groupname) {

  }
}

```

```sh
client Requests
  LOGIN;
  JOINGROUP;
  LEAVEGROUP;
  CREATEGROUP;
  CONNECTUSER;
  SENDMESSAGE;

```
