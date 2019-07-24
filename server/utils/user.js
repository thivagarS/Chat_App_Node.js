
 class User{
    constructor(){
         this.user = [];
         this.roomList = [];
    }

    addUser(id, name, room) {
         const newUser = {
             id,
             name,
             room
         }
         this.user.push(newUser);
         if(!(this.roomList.indexOf(room) >= 0))
            this.roomList.push(room);
         return newUser;
    }

    getUser(id){
        return this.user.find(user => user.id === id)
    }

    removeUser(id) {
        if(this.getUser(id)) {
            const index = this.user.findIndex(user => user.id === id)
            if(index >= 0) {
                return this.user.splice(index, 1)
            }
        }
    }

    getUserList(room) {
        const userList = this.user.filter(user => user.room === room)
        const list = userList.map(user => user.name)
        return list
    }

    getUserByName(userName){
        return this.user.find(user => user.name === userName);
    }

    getRoomList() {
        return this.roomList;
    }
}

module.exports= {User}