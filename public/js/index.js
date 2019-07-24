import axios from "axios";

const renderRoomList = roomList => {
    document.getElementById("roomList").textContent = "";
    const roomDataList = jQuery("#roomList")
    roomList.forEach(element => {
        roomDataList.append(`<option value="${element}">${element}</option>`)
    });
}

document.querySelector(".room__list").addEventListener('click', async () => {
    const roomData = await axios.get(`${window.location.protocol}//${window.location.host}/getUserList`);
    const roomList = roomData.data;
    renderRoomList(roomList)
    console.log(roomList)
})