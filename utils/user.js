const users = [];

const userJoin = (sid, username)=>{
    const user = {sid, username};
    users.push(user);
    return user;
}

const allUsers = ()=>{
    return {users};
}

const getCurrentUser = (id)=>{
    let user = users.find((el)=> {
        console.log(el);
        return el.sid == id;
    })
    console.log(user);
    return user;
}

module.exports = {
    userJoin,
    allUsers,
    getCurrentUser
}